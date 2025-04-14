import type { CharacterSheetQuadroneContext } from 'src/types/types';
import { ActorSheetRuntime } from '../ActorSheetRuntime.svelte';
import type { RegisteredTab } from '../types';
import ActorActionsTab from 'src/sheets/quadrone/actor/tabs/ActorActionsTab.svelte';
import { CONSTANTS } from 'src/constants';
import ActorEffectsTab from 'src/sheets/quadrone/actor/tabs/ActorEffectsTab.svelte';
import ActorInventoryTab from 'src/sheets/quadrone/actor/tabs/ActorInventoryTab.svelte';
import ActorJournalTab from 'src/sheets/quadrone/actor/tabs/ActorJournalTab.svelte';
import ActorSpecialTraitsTab from 'src/sheets/quadrone/actor/tabs/ActorSpecialTraitsTab.svelte';
import ActorSpellbookTab from 'src/sheets/quadrone/actor/tabs/ActorSpellbookTab.svelte';
import CharacterAttributesTab from 'src/sheets/quadrone/actor/tabs/CharacterAttributesTab.svelte';
import CharacterBiographyTab from 'src/sheets/quadrone/actor/tabs/CharacterBiographyTab.svelte';
import CharacterFeaturesTab from 'src/sheets/quadrone/actor/tabs/CharacterFeaturesTab.svelte';
import CharacterBastionTab from 'src/sheets/quadrone/actor/tabs/CharacterBastionTab.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

const defaultCharacterQuadroneTabs: RegisteredTab<CharacterSheetQuadroneContext>[] =
  [
    {
      title: 'TIDY5E.Action.TabName',
      content: {
        component: ActorActionsTab,
        type: 'svelte',
      },
      id: CONSTANTS.TAB_ACTOR_ACTIONS,
      layout: 'quadrone',
    },
    {
      title: 'DND5E.Effects',
      content: {
        component: ActorEffectsTab,
        type: 'svelte',
      },
      id: CONSTANTS.TAB_CHARACTER_EFFECTS,
      layout: 'quadrone',
    },
    {
      title: 'DND5E.Inventory',
      content: {
        component: ActorInventoryTab,
        type: 'svelte',
      },
      id: CONSTANTS.TAB_ACTOR_INVENTORY,
      layout: 'quadrone',
    },
    {
      title: 'TIDY5E.JournalTabName',
      content: {
        component: ActorJournalTab,
        type: 'svelte',
      },
      id: CONSTANTS.TAB_CHARACTER_JOURNAL,
      layout: 'quadrone',
    },
    {
      title: 'DND5E.SpecialTraits',
      content: {
        component: ActorSpecialTraitsTab,
        type: 'svelte',
      },
      id: CONSTANTS.TAB_ACTOR_SPECIAL_TRAITS,
      layout: 'quadrone',
    },
    {
      title: 'DND5E.Spellbook',
      content: {
        component: ActorSpellbookTab,
        type: 'svelte',
      },
      id: CONSTANTS.TAB_ACTOR_SPELLBOOK,
      layout: 'quadrone',
    },
    {
      title: 'DND5E.Attributes',
      content: {
        component: CharacterAttributesTab,
        type: 'svelte',
      },
      id: CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
      layout: 'quadrone',
    },
    {
      title: 'DND5E.Biography',
      content: {
        component: CharacterBiographyTab,
        type: 'svelte',
      },
      id: CONSTANTS.TAB_CHARACTER_BIOGRAPHY,
      layout: 'quadrone',
    },
    {
      title: 'DND5E.Features',
      content: {
        component: CharacterFeaturesTab,
        type: 'svelte',
      },
      id: CONSTANTS.TAB_CHARACTER_FEATURES,
      layout: 'quadrone',
    },
    {
      title: 'DND5E.Bastion.Label',
      content: {
        component: CharacterBastionTab,
        type: 'svelte',
      },
      enabled: (context) => {
        const { enabled } = FoundryAdapter.getSystemSetting<{
          enabled: boolean;
        }>(CONSTANTS.SYSTEM_SETTING_BASTION_CONFIGURATION);
        const { basic, special } = CONFIG.DND5E.facilities.advancement;
        const threshold = Math.min(
          ...Object.keys(basic).map(Number),
          ...Object.keys(special).map(Number)
        );

        return context.actor.system.details.level >= threshold && enabled;
      },
      id: CONSTANTS.TAB_CHARACTER_BASTION,
      layout: 'quadrone',
    },
  ];

const singleton = new ActorSheetRuntime<CharacterSheetQuadroneContext>(
  defaultCharacterQuadroneTabs
);

export default singleton;
