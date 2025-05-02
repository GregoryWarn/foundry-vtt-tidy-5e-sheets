import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type { ApplicationConfiguration } from 'src/types/application.types';
import { mount } from 'svelte';
import ConfigureSections from './ConfigureSections.svelte';
import type { TidySectionBase } from 'src/types/types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { getThemeV2 } from 'src/theme/theme';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { SectionConfig } from 'src/features/sections/sections.types';

export type BooleanSetting = {
  type: 'boolean';
  label: string;
  checked: boolean;
  prop: string;
};

export type SectionSetting = BooleanSetting;

export type SectionOptionGroup = {
  title: string;
  settings: SectionSetting[];
};

export type ConfigureSectionsApplicationConstructorArgs = {
  settings: {
    optionsGroups?: SectionOptionGroup[];
    sections: TidySectionBase[];
    tabId: string;
    formTitle: string;
  };
} & Partial<ApplicationConfiguration>;

export type SectionConfigItem = {
  key: string;
  label: string;
  show: boolean;
};

export class ConfigureSectionsApplication extends SvelteApplicationMixin(
  foundry.applications.api.DocumentSheetV2
) {
  sections = $state<SectionConfigItem[]>([]);
  optionsGroups = $state<SectionOptionGroup[]>([]);
  tabId: string;
  theme: string = $state<string>('');
  formTitle: string;

  constructor({
    settings: { sections, tabId, optionsGroups, formTitle },
    ...rest
  }: ConfigureSectionsApplicationConstructorArgs) {
    super(rest);
    this.sections = sections.map((section) => ({
      key: section.key,
      label: FoundryAdapter.localize(section.label),
      show: section.show !== false,
    }));
    this.optionsGroups = [...(optionsGroups ?? [])];
    this.tabId = tabId;
    this.theme = getThemeV2(rest.document);
    this.formTitle = formTitle;
  }

  static DEFAULT_OPTIONS: Partial<
    ApplicationConfiguration & { dragDrop: Partial<DragDropConfiguration>[] }
  > = {
    classes: [CONSTANTS.MODULE_ID, 'app-v2', 'quadrone', 'tab-configuration'],
    tag: 'div',
    sheetConfig: false,
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
    },
    position: {
      width: 550,
      height: 600,
    },
    actions: {},
    submitOnClose: false,
  };

  _createComponent(node: HTMLElement): Record<string, any> {
    const context = new Map<any, any>([]);

    const component = mount(ConfigureSections, {
      target: node,
      context: context,
      props: {
        sections: this.sections,
        application: this,
        optionGroups: this.optionsGroups,
        title: this.formTitle,
      },
    });

    return component;
  }

  async _preRender(...args: any[]) {
    super._preRender(...args);

    for (let group of this.optionsGroups) {
      for (let setting of group.settings) {
        if (setting.type === 'boolean') {
          setting.checked = foundry.utils.getProperty(
            this.document,
            setting.prop
          );
        }
      }
    }
  }

  _configureEffects(): void {
    $effect(() => {
      // remove all other theme-{name} classes
      const element = this.element as HTMLElement;
      // TODO: Use a fixed list of known themes, possibly from Foundry itself?
      const toRemove = Array.from(element.classList).filter((value: string) =>
        value.startsWith('theme-')
      );
      toRemove.forEach((classToRemove) =>
        element.classList.remove(classToRemove)
      );

      // add my theme-{name} class to element
      element.classList.toggle('themed', true);
      element.classList.toggle(`theme-${this.theme}`, true);
    });
  }

  /* -------------------------------------------- */

  /** @override */
  _onClose(..._: any[]) {}

  /* -------------------------------------------- */

  /** @override */
  _onFirstRender(..._: any[]) {}

  /* -------------------------------------------- */

  async saveChanges() {
    const toSave: Record<string, any> = {};

    for (let group of this.optionsGroups) {
      for (let setting of group.settings) {
        if (setting.type === 'boolean') {
          toSave[setting.prop] = setting.checked;
        }
      }
    }

    const sectionConfig = TidyFlags.sectionConfig.get(this.document) ?? {};

    sectionConfig[this.tabId] = this.sections.reduce<
      Record<string, SectionConfig>
    >((result, curr, i) => {
      result[curr.key] = {
        key: curr.key,
        order: i,
        show: curr.show !== false,
      };
      return result;
    }, {});

    toSave[TidyFlags.sectionConfig.prop] = sectionConfig;

    await this.document.update(toSave);

    this.close();
  }

  async useDefault() {
    const proceed = await foundry.applications.api.DialogV2.confirm({
      window: {
        title: FoundryAdapter.localize('TIDY5E.UseDefaultDialog.title'),
      },
      content: `<p>${FoundryAdapter.localize(
        'TIDY5E.UseDefaultDialog.text'
      )}</p>`,
    });

    if (!proceed) {
      return;
    }

    const sectionConfig = TidyFlags.sectionConfig.get(this.document) ?? {};
    delete sectionConfig[this.tabId];
    // TODO: Figure out how to do this in a less suppressing way.
    //@ts-expect-error
    sectionConfig[`-=${this.tabId}`] = null;
    await this.document.update({
      [TidyFlags.sectionConfig.prop]: sectionConfig,
    });
    await this.close();
  }
}
