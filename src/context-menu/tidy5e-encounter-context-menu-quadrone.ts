import type { Actor5e } from 'src/types/types';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { Tidy5eNpcSheetQuadrone } from 'src/sheets/quadrone/Tidy5eNpcSheetQuadrone.svelte';

/**
 * Prepare an array of context menu options which are available for a member of a encounter.
 * @param encounter    The encounter for which the context menu is activated.
 * @param actor    The actor for whom the context menu is activate.
 * @returns        Context menu options.
 */
export function getEncounterMemberContextOptionsQuadrone(
  encounter: Actor5e,
  memberPromise: Promise<Actor5e>
): ContextMenuEntry[] {
  let options: ContextMenuEntry[] = [
    {
      name: 'DND5E.Group.Action.View',
      icon: `<i class="fas fa-eye fa-fw"></i>`,
      callback: async () => (await memberPromise)?.sheet.render(true),
      condition: () =>
        encounter.isOwner && !FoundryAdapter.isLockedInCompendium(encounter),
    },
    {
      name: 'DND5E.HPFormulaRollMessage',
      icon: `<i class="fas fa-dice-d6 fa-fw"></i>`,
      callback: async () => {
        await new Tidy5eNpcSheetQuadrone({
          document: await memberPromise,
        }).rollFormula();
        encounter.sheet.render();
      },
      condition: () =>
        encounter.isOwner && !FoundryAdapter.isLockedInCompendium(encounter),
    },
    {
      name: 'DND5E.Group.Action.Remove',
      icon: `<i class="fas fa-trash fa-fw"></i>`,
      callback: async () =>
        await encounter.system.removeMember(await memberPromise),
      condition: () =>
        encounter.isOwner && !FoundryAdapter.isLockedInCompendium(encounter),
    },
  ];

  return options;
}
