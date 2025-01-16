import SvelteFormApplicationBase from 'src/applications/SvelteFormApplicationBase';
import { mount } from 'svelte';
import WorldSettings from './WorldSettings.svelte';
import {
  SettingsProvider,
  getCurrentSettings,
  type Tidy5eSettingKey,
  type CurrentSettings,
} from 'src/settings/settings.svelte';
import type {
  DefaultTabSelectionFields,
  WorldSettingsContext,
  WorldSettingsFunctions,
} from './WorldSettings.types';
import type { RegisteredTab } from 'src/runtime/types';
import { CharacterSheetRuntime } from 'src/runtime/CharacterSheetRuntime';
import { NpcSheetRuntime } from 'src/runtime/NpcSheetRuntime';
import { VehicleSheetRuntime } from 'src/runtime/VehicleSheetRuntime';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TabManager } from 'src/runtime/tab/TabManager';
import { debug, error } from 'src/utils/logging';
import { CONSTANTS } from 'src/constants';

export class WorldSettingsFormApplication extends SvelteFormApplicationBase {
  unchangedSettings?: CurrentSettings;
  context = $state<WorldSettingsContext>();

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      height: 750,
      title: 'TIDY5E.WorldSettings.Menu.title',
      width: 750,
      classes: [
        ...super.defaultOptions.classes,
        'settings',
        'app-v1',
        CONSTANTS.SHEET_LAYOUT_CLASSIC,
      ],
      id: 'tidy-5e-sheets-world-settings',
      popOut: true,
    };
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-form-template.hbs');
  }

  getData(): WorldSettingsContext {
    const currentSettings = getCurrentSettings();

    return {
      settings: {
        hideDeathSavesFromPlayers: currentSettings.hideDeathSavesFromPlayers,
        defaultDeathSaveRoll: currentSettings.defaultDeathSaveRoll,
        useCharacterEncumbranceBar: currentSettings.useCharacterEncumbranceBar,
        useNpcEncumbranceBar: currentSettings.useNpcEncumbranceBar,
        useVehicleEncumbranceBar: currentSettings.useVehicleEncumbranceBar,
        showPlayerName: currentSettings.showPlayerName,
        showExpandedLimitedView: currentSettings.showExpandedLimitedView,
        itemCardsFixKey: currentSettings.itemCardsFixKey,
        useCircularPortraitStyle: currentSettings.useCircularPortraitStyle,
        permanentlyUnlockCharacterSheetForGm:
          currentSettings.permanentlyUnlockCharacterSheetForGm,
        permanentlyUnlockNpcSheetForGm:
          currentSettings.permanentlyUnlockNpcSheetForGm,
        permanentlyUnlockVehicleSheetForGm:
          currentSettings.permanentlyUnlockVehicleSheetForGm,
        limitEffectsManagementToGm: currentSettings.limitEffectsManagementToGm,
        useCharacterInspiration: currentSettings.useCharacterInspiration,
        useVehicleMotion: currentSettings.useVehicleMotion,
        useExhaustion: currentSettings.useExhaustion,
        showTraitLabels: currentSettings.showTraitLabels,
        allowCantripsToBePrepared: currentSettings.allowCantripsToBePrepared,
        allowHpMaxOverride: currentSettings.allowHpMaxOverride,
        showActiveEffectsMarker: currentSettings.showActiveEffectsMarker,
        useTotalSheetLock: currentSettings.useTotalSheetLock,
        lockExpChanges: currentSettings.lockExpChanges,
        lockHpMaxChanges: currentSettings.lockHpMaxChanges,
        lockConfigureSheet: currentSettings.lockConfigureSheet,
        lockMoneyChanges: currentSettings.lockMoneyChanges,
        lockLevelSelector: currentSettings.lockLevelSelector,
        lockItemQuantity: currentSettings.lockItemQuantity,
        initialNpcSheetTab: currentSettings.initialNpcSheetTab,
        showNpcRestInChat: currentSettings.showNpcRestInChat,
        showNpcActorLinkMarker: currentSettings.showNpcActorLinkMarker,
        initialCharacterSheetTab: currentSettings.initialCharacterSheetTab,
        initialVehicleSheetTab: currentSettings.initialVehicleSheetTab,
        includeTidySectionFieldsInDefaultSheets:
          currentSettings.includeTidySectionFieldsInDefaultSheets,
        itemIdentificationPermission:
          currentSettings.itemIdentificationPermission,
        includeFlagsInSpellScrollCreation:
          currentSettings.includeFlagsInSpellScrollCreation,
        useTidySpellSchoolIcons: currentSettings.useTidySpellSchoolIcons,
        defaultCustomSections: currentSettings.defaultCustomSections,
      },
      defaultCharacterTabs: this.mapTabSelectionFields(
        CharacterSheetRuntime.getAllRegisteredTabs(),
        currentSettings.defaultCharacterSheetTabs
      ),
      defaultNpcTabs: this.mapTabSelectionFields(
        NpcSheetRuntime.getAllRegisteredTabs(),
        currentSettings.defaultNpcSheetTabs
      ),
      defaultVehicleTabs: this.mapTabSelectionFields(
        VehicleSheetRuntime.getAllRegisteredTabs(),
        currentSettings.defaultVehicleSheetTabs
      ),
      exhaustionConfig: {
        ...SettingsProvider.settings.exhaustionConfig.options.default,
        ...currentSettings.exhaustionConfig,
      },
      vehicleExhaustionConfig: {
        ...SettingsProvider.settings.vehicleExhaustionConfig.options.default,
        ...currentSettings.vehicleExhaustionConfig,
      },
    };
  }

  createComponent(node: HTMLElement): Record<string, any> {
    this.context = this.getData();

    debug('World Settings context data', this.context);

    return mount(WorldSettings, {
      target: node,
      context: new Map<any, any>([
        ['context', this.context],
        [
          'functions',
          {
            save: this.saveChangedSettings.bind(this),
            apply: this.applyChangedSettings.bind(this),
            resetDefaultTabs: this.resetDefaultTabs.bind(this),
          } satisfies WorldSettingsFunctions,
        ],
        ['appId', this.appId],
      ]),
    });
  }

  mapTabSelectionFields(
    registeredTabs: RegisteredTab<any>[],
    selectedTabIds: string[]
  ): DefaultTabSelectionFields {
    const available = registeredTabs
      .filter((t) => !selectedTabIds.includes(t.id))
      .map((t) => ({
        id: t.id,
        label: FoundryAdapter.localize(TabManager.getTabTitle(t)),
      }));

    const selected = registeredTabs
      .filter((t) => selectedTabIds.includes(t.id))
      .sort(
        (a, b) => selectedTabIds.indexOf(a.id) - selectedTabIds.indexOf(b.id)
      )
      .map((t) => ({
        id: t.id,
        label: FoundryAdapter.localize(TabManager.getTabTitle(t)),
      }));

    return {
      available,
      selected,
    };
  }

  validate(context: WorldSettingsContext) {
    let valid = true;

    if (
      context.defaultCharacterTabs.selected.length === 0 ||
      context.defaultNpcTabs.selected.length === 0 ||
      context.defaultVehicleTabs.selected.length === 0
    ) {
      valid = false;
      error(
        FoundryAdapter.localize(
          'TIDY5E.Settings.DefaultSheetTabs.AtLeastOneTabRequiredErrorMessage'
        ),
        true
      );
    }

    if (
      context.exhaustionConfig.type === 'specific' &&
      context.exhaustionConfig.levels < 1
    ) {
      valid = false;
      error(
        FoundryAdapter.localize(
          'TIDY5E.WorldSettings.Exhaustion.AtLeastOneLevelRequiredErrorMessage'
        ),
        true
      );
    }

    if (
      context.vehicleExhaustionConfig.type === 'specific' &&
      context.vehicleExhaustionConfig.levels < 1
    ) {
      valid = false;
      error(
        FoundryAdapter.localize(
          'TIDY5E.WorldSettings.VehicleExhaustion.AtLeastOneLevelRequiredErrorMessage'
        ),
        true
      );
    }

    // Add more data validation here as needed

    return valid;
  }

  async applyChangedSettings() {
    if (!this.context || !this.validate(this.context)) {
      return false;
    }

    if (this.context.exhaustionConfig.type === 'specific') {
      this.context.exhaustionConfig.hints =
        this.context.exhaustionConfig.hints.slice(
          0,
          this.context.exhaustionConfig.levels + 1
        );
    }

    if (this.context.vehicleExhaustionConfig.type === 'specific') {
      this.context.vehicleExhaustionConfig.hints =
        this.context.vehicleExhaustionConfig.hints.slice(
          0,
          this.context.vehicleExhaustionConfig.levels + 1
        );
    }

    const newSettings: Partial<CurrentSettings> = {
      ...this.context.settings,
      defaultCharacterSheetTabs: this.context.defaultCharacterTabs.selected.map(
        (t) => t.id
      ),
      defaultNpcSheetTabs: this.context.defaultNpcTabs.selected.map(
        (t) => t.id
      ),
      defaultVehicleSheetTabs: this.context.defaultVehicleTabs.selected.map(
        (t) => t.id
      ),
      exhaustionConfig: this.context.exhaustionConfig,
      vehicleExhaustionConfig: this.context.vehicleExhaustionConfig,
    };

    const currentSettings = getCurrentSettings();

    const keys = Object.keys(newSettings) as Tidy5eSettingKey[];
    for (let key of keys) {
      const currentValue = currentSettings[key];
      const newValue = newSettings[key];
      if (currentValue !== newValue) {
        await FoundryAdapter.setTidySetting(key, newValue);
        debug(`Updated ${key} to ${newValue}`);
      }
    }

    return true;
  }

  async saveChangedSettings() {
    const changesApplied = await this.applyChangedSettings();

    if (!changesApplied) {
      return;
    }

    this.close();
  }

  resetDefaultTabs(actorType: string) {
    if (!this.context) {
      return;
    }

    switch (actorType) {
      case CONSTANTS.SHEET_TYPE_CHARACTER:
        this.context.defaultCharacterTabs = this.mapTabSelectionFields(
          CharacterSheetRuntime.getAllRegisteredTabs(),
          [
            ...SettingsProvider.settings.defaultCharacterSheetTabs.options
              .default,
          ]
        );
        break;
      case CONSTANTS.SHEET_TYPE_NPC:
        this.context.defaultNpcTabs = this.mapTabSelectionFields(
          NpcSheetRuntime.getAllRegisteredTabs(),
          [...SettingsProvider.settings.defaultNpcSheetTabs.options.default]
        );
        break;
      case CONSTANTS.SHEET_TYPE_VEHICLE:
        this.context.defaultVehicleTabs = this.mapTabSelectionFields(
          VehicleSheetRuntime.getAllRegisteredTabs(),
          [...SettingsProvider.settings.defaultVehicleSheetTabs.options.default]
        );
        break;
    }
  }
}
