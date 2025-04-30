import { mount } from 'svelte';
import AssignSpellsToSourceClasses from './SpellSourceClassAssignments.svelte';
import type { Actor5e } from 'src/types/types';
import type { Item5e } from 'src/types/item.types';
import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { CoarseReactivityProvider } from 'src/features/reactivity/CoarseReactivityProvider.svelte';
import type {
  ApplicationConfiguration,
  DocumentSheetApplicationConfiguration,
} from 'src/types/application.types';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';

export type SpellSourceClassAssignment = {
  /**
   * The spell to receive an assignment.
   */
  item: Item5e;
  /**
   * Represents the chosen source class.
   */
  sourceClass: string;
};

export type SpellSourceClassAssignmentsContext = {
  actor: Actor5e;
  assignments: SpellSourceClassAssignment[];
};

export default class SpellSourceClassAssignmentsFormApplication extends SvelteApplicationMixin<
  DocumentSheetApplicationConfiguration,
  SpellSourceClassAssignmentsContext
>(foundry.applications.api.DocumentSheetV2) {
  context = new CoarseReactivityProvider<
    SpellSourceClassAssignmentsContext | undefined
  >(undefined);
  updateHook: number | undefined;

  static DEFAULT_OPTIONS: Partial<ApplicationConfiguration> = {
    classes: [
      CONSTANTS.MODULE_ID,
      'application',
      'application-shell',
      'sheet',
      'classic',
      'tidy-spell-source-class-assignments-application',
      'app-v2',
      'scrollable-window-content',
    ],
    sheetConfig: false,
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
    },
    position: {
      width: 700,
      height: 500,
    },
    actions: {},
  };

  _createComponent(node: HTMLElement): Record<string, any> {
    return mount(AssignSpellsToSourceClasses, {
      target: node,
      context: new Map<any, any>([
        ['appId', this.appId],
        ['context', this._context],
      ]),
    });
  }

  async _prepareContext(): Promise<SpellSourceClassAssignmentsContext> {
    return {
      actor: this.document,
      assignments: this.document.items
        .filter((item: Item5e) => item.type === CONSTANTS.ITEM_TYPE_SPELL)
        .map((item: Item5e) => ({
          item,
          sourceClass: 'test',
        })),
    };
  }

  get title() {
    return FoundryAdapter.localize('TIDY5E.Utilities.AssignSpellsToClasses');
  }
}
