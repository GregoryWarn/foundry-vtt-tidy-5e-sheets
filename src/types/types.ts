import type { Component } from 'svelte';
import type { ContainerContents, Item5e, ItemChatData } from './item.types';
import type {
  OnContentReadyParams,
  OnRenderParams,
  RenderScheme,
} from 'src/api/api.types';
import type {
  RegisteredCustomActorTrait,
  RegisteredPortraitMenuCommand,
} from 'src/runtime/types';
import type { DocumentFilters } from 'src/runtime/item/item.types';
import type { UtilityToolbarCommandParams } from 'src/components/utility-bar/types';
import type { CONSTANTS } from 'src/constants';
import type { Dnd5eActorCondition } from 'src/foundry/foundry-and-system';
import type { Activity5e } from 'src/foundry/dnd5e.types';
import type { AttributePinFlag } from 'src/foundry/TidyFlags.types';

export type Actor5e = any;
export type TokenDocument = any;

export type SvelteTabContent = {
  type: 'svelte';
  component: Component<any>;
  cssClass?: string;
  getProps?: (data: any) => Record<string, any>;
  getContext?: (context: Map<any, any>) => Map<any, any>;
};

export type HtmlTabContent = {
  type: 'html';
  html: string;
  cssClass?: string;
  renderScheme: RenderScheme;
};

// TODO: Give better name; this is the prepared HTML that is ready to render
export interface HtmlRuntimeContent {
  type: 'html';
  html: string | ((data: any) => string);
  cssClass?: string;
  renderScheme: RenderScheme;
}

export interface OnRenderTabParams extends OnRenderParams {
  tabContentsElement: HTMLElement;
}

// TODO: Make this generic in such a way that correct props are actually required and that an array of tabs can have hetergeneity of component types without a crazy TS type
export type Tab = {
  title: string | ((tabContext: Record<string, any>) => string);
  id: string;
  content: SvelteTabContent | HtmlTabContent;
  onRender?: (params: OnRenderTabParams) => void;
  activateDefaultSheetListeners?: boolean;
  autoHeight?: boolean;
  condition?: (document: any) => boolean;
};

export type CustomContent = {
  selector?: string;
  position?: string;
  content: HtmlRuntimeContent;
  onContentReady?: (params: OnContentReadyParams) => void;
  onRender?: (params: OnRenderParams) => void;
  activateDefaultSheetListeners?: boolean;
};

export type RenderableCustomActorTrait = RegisteredCustomActorTrait;

export type ClassSummary = {
  class?: string;
  subclass?: string;
  level?: string;
};

export type CharacterFeatureSection = {
  isClass?: boolean;
  showUsesColumn?: boolean;
  showUsagesColumn?: boolean;
  showLevelColumn?: boolean;
  showFeatureTypeColumn?: boolean;
  showRequirementsColumn?: boolean;
  canCreate: boolean;
  custom?: CustomSectionOptions;
} & FeatureSection;

export type SpellcastingInfo = {
  currentFilteredClass: Item5e;
  calculations: SpellCalculations;
  prepared?: {
    value: number;
    max: number;
  };
};

export type SpellCalculations = {
  dc: string;
  dcTooltip: string;
  rangedMod: string;
  rangedTooltip: string;
  rangedHasBonus: boolean;
  meleeMod: string;
  meleeTooltip: string;
  meleeHasBonus: boolean;
};

export type LinkedUses = {
  value: number;
  max: number;
  valueProp: string;
  spentProp: string;
  maxProp: string;
  doc: any;
};

export type ActorInventoryTypes = Record<string, InventorySection>;

export type CustomSectionOptions = {
  section: string;
  creationItemTypes: string[];
};

export type InventorySection = {
  items: Item5e[];
  canCreate: boolean;
} & TidySectionBase;

export type GenericFavoriteSection = {
  items: Item5e[];
  canCreate: false;
} & TidySectionBase;

export type EffectFavoriteSection = {
  effects: FavoriteEffectContext[];
  canCreate: false;
} & TidySectionBase;

export type CharacterItemPartitions = {
  items: Item5e[];
  spells: Item5e[];
  facilities: Item5e[];
  feats: Item5e[];
  species: Item5e[];
  backgrounds: Item5e[];
  classes: Item5e[];
  subclasses: Item5e[];
};

export type TidySectionBase = {
  label: string;
  dataset: Record<string, any>;
  custom?: CustomSectionOptions;
  key: string;
  show: boolean; // default: true
  isExternal?: boolean;
};

export type FeatureSection = {
  items: Item5e[];
  hasActions?: boolean;
  hasUses?: boolean;
} & TidySectionBase;

export type FacilitySection = {
  items: Item5e[];
} & TidySectionBase;

export type ActivitySection = {
  activities: Activity5e[];
} & TidySectionBase;

export type TypedActivityFavoriteSection = ActivitySection & {
  type: typeof CONSTANTS.FAVORITES_SECTION_TYPE_ACTIVITY;
};

export type VehicleCargoSection = {
  items: Item5e[];
  css?: string;
  editableName?: boolean;
  columns: SimpleEditableColumn[];
} & TidySectionBase;

export type VehicleFeatureSection = {
  crewable?: boolean;
  columns?: SimpleEditableColumn[];
} & FeatureSection;

export type SimpleEditableColumn = {
  label: string;
  css?: string;
  property: string;
  maxProperty?: string;
  editable?: string;
};

export type SpellbookSection = {
  order?: number | string;
  usesSlots: boolean;
  canCreate: boolean;
  canPrepare: boolean;
  spells: Item5e[];
  uses?: number;
  slots?: number;
  override?: number;
  prop?: string;
} & TidySectionBase;

export type AvailableLevel = {
  level: number;
  delta: number;
  disabled: boolean;
};

export type AttunementContext = { icon: string; cls: string; title: string };

export type ItemSaveContext = {
  ability: string;
  abilityTitle: string;
  multipleAbilities: boolean;
  dc: {
    calculation: string;
    formula: string;
    value: number;
  };
};

export type CharacterItemContext = {
  activities?: ActivityItemContext[];
  attunement?: AttunementContext;
  availableLevels?: AvailableLevel[];
  canToggle?: boolean;
  chosen?: ChosenFacilityContext;
  concealDetails?: boolean;
  containerContents?: ContainerContents;
  favoriteId?: string;
  group?: string;
  hasRecharge?: boolean;
  hasUses?: boolean;
  isStack?: boolean;
  linkedUses?: LinkedUses;
  needsSubclass?: boolean;
  save?: ItemSaveContext;
  toHit?: number | null;
  toggleClass?: string;
  toggleTitle?: string;
  totalWeight?: number;
  concentration?: boolean;
  parent?: Item5e;
};

export type ActivityItemContext = {
  activation: string;
  hasRecharge: boolean;
  isOnCooldown: boolean;
  id: string;
  activity: Activity5e;
  save: {
    ability: string;
  } | null;
  toHit: number | null;
};

export type TypedEffectFavoriteSection = EffectFavoriteSection & {
  type: typeof CONSTANTS.FAVORITES_SECTION_TYPE_EFFECT;
};

// TODO: Trim to minimum necessary
export type FavoriteEffectContext = {
  effect: ActiveEffect5e;
  effectId: string;
  id: string;
  img: string;
  sort: number;
  subtitle: string;
  suppressed: boolean;
  title: string;
  toggle: {
    applicable: boolean;
    value: boolean;
  };
};

export type FavoriteSection =
  | (InventorySection & {
      type: typeof CONSTANTS.FAVORITES_SECTION_TYPE_INVENTORY;
    })
  | (FacilitySection & {
      type: typeof CONSTANTS.FAVORITES_SECTION_TYPE_FACILITY;
    })
  | (SpellbookSection & {
      type: typeof CONSTANTS.FAVORITES_SECTION_TYPE_SPELLBOOK;
    })
  | (CharacterFeatureSection & {
      type: typeof CONSTANTS.FAVORITES_SECTION_TYPE_FEATURE;
    })
  | TypedActivityFavoriteSection
  | TypedEffectFavoriteSection
  | (GenericFavoriteSection & {
      type: typeof CONSTANTS.FAVORITES_SECTION_TYPE_GENERIC;
    });

export type LanguageTraitContext = {
  label: string;
  value?: unknown;
};

export type AttributeItemPinContext = {
  document: Item5e;
  linkedUses?: LinkedUses;
} & AttributePinFlag & { type: 'item' };

export type AttributeActivityPinContext = {
  document: Activity5e;
} & AttributePinFlag & { type: 'activity' };

export type AttributePinContext =
  | AttributeItemPinContext
  | AttributeActivityPinContext;

export type CharacterSheetContext = {
  actorClassesToImages: Record<string, string>;
  allowMaxHpOverride: boolean;
  appearanceEnrichedHtml: string;
  attributePins: AttributePinContext[];
  bastion: {
    description: string;
  };
  biographyEnrichedHtml: string;
  bondEnrichedHtml: string;
  conditions: Dnd5eActorCondition[];
  containerPanelItems: ContainerPanelItemContext[];
  defenders: Actor5e[];
  effects: Record<string, EffectCategory<ActiveEffectContext>>;
  epicBoonsEarned: string | undefined;
  facilities: {
    basic: {
      available: AvailableBastionActionContext[];
      chosen: ChosenFacilityContext[];
      max: number;
      value: number;
    };
    special: {
      available: AvailableBastionActionContext[];
      chosen: ChosenFacilityContext[];
      max: number;
      value: number;
    };
  } & Record<
    string,
    {
      available: AvailableBastionActionContext[];
      chosen: ChosenFacilityContext[];
      max: number;
      value: number;
    }
  >;
  favorites: FavoriteSection[];
  features: CharacterFeatureSection[];
  flawEnrichedHtml: string;
  hirelings: Actor5e[];
  idealEnrichedHtml: string;
  inventory: InventorySection[];
  itemContext: Record<string, CharacterItemContext>;
  languages: LanguageTraitContext[];
  notes1EnrichedHtml: string;
  notes2EnrichedHtml: string;
  notes3EnrichedHtml: string;
  notes4EnrichedHtml: string;
  notesEnrichedHtml: string;
  showContainerPanel: boolean;
  spellComponentLabels: Record<string, string>;
  spellbook: SpellbookSection[];
  spellcastingInfo: SpellcastingInfo;
  spellSlotTrackerMode:
    | typeof CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS
    | typeof CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX;
  traitEnrichedHtml: string;
  utilities: Utilities<CharacterSheetContext>;
} & ActorSheetContextV1;

/** A list of available actions that can be done on behalf of a facility type. */
type AvailableBastionActionContext = {
  label: string;
};

export type ChosenFacilityContext = {
  id: string;
  labels: {
    order: string;
  };
  name: string;
  building: {
    built: boolean;
    size: string;
  };
  disabled: boolean;
  free: boolean;
  progress: {
    value: number;
    max: number;
    order: string;
    pct: number;
  };
  craft: Item5e | null;
  creatures: FacilityOccupantContext[];
  defenders: FacilityOccupantContext[];
  executing: string | undefined;
  hirelings: FacilityOccupantContext[];
  img: string;
  isSpecial: boolean;
  subtitle: string;
  facility: Item5e;
};

export type FacilityOccupantContext = {
  /** If present, the occupant's source actor was found. If undefined, then this is a broken link. */
  actor?: Actor5e;
  /** If present, this indicates there is an occupant configured to be here. */
  uuid?: string;
};

export type NpcAbilitySection = {
  canCreate: boolean;
  custom?: CustomSectionOptions;
  isClass?: boolean;
} & FeatureSection;

export type NpcItemContext = {
  activities?: ActivityItemContext[];
  attunement?: AttunementContext;
  availableLevels?: AvailableLevel[];
  canToggle?: boolean;
  concentration?: boolean;
  containerContents?: ContainerContents;
  hasRecharge?: boolean;
  hasUses?: boolean;
  isStack?: boolean;
  linkedUses?: LinkedUses;
  needsSubclass?: boolean;
  parent?: Item5e;
  save?: ItemSaveContext;
  toHit?: number | null;
  toggleTitle?: string;
  totalWeight?: number;
};

export type NpcHabitat = {
  type: string;
  subtype?: string;
};

export type NpcSheetContext = {
  appearanceEnrichedHtml: string;
  biographyEnrichedHtml: string;
  bondEnrichedHtml: string;
  conditions: Dnd5eActorCondition[];
  containerPanelItems: ContainerPanelItemContext[];
  defaultSkills: Set<string>;
  features: NpcAbilitySection[];
  flawEnrichedHtml: string;
  hasLegendaries: boolean;
  habitat: { label: string }[];
  hideEmptySpellbook: boolean;
  idealEnrichedHtml: string;
  inventory: InventorySection[];
  itemContext: Record<string, NpcItemContext>;
  languages: LanguageTraitContext[];
  longRest: (event: Event) => Promise<unknown>;
  notes1EnrichedHtml: string;
  notes2EnrichedHtml: string;
  notes3EnrichedHtml: string;
  notes4EnrichedHtml: string;
  notesEnrichedHtml: string;
  shortRest: (event: Event) => Promise<void>;
  showContainerPanel: boolean;
  showLoyalty: boolean;
  showSpellbookTab: boolean;
  spellComponentLabels: Record<string, string>;
  spellbook: SpellbookSection[];
  spellcastingInfo: SpellcastingInfo;
  spellSlotTrackerMode:
  | typeof CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS
  | typeof CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX;
  traitEnrichedHtml: string;
  treasure: { label: string }[];
  utilities: Utilities<NpcSheetContext>;
} & ActorSheetContextV1;

export type VehicleItemContext = {
  activities?: ActivityItemContext[];
  canToggle?: boolean;
  containerContents?: ContainerContents;
  cover?: string;
  hasUses?: boolean;
  save?: ItemSaveContext;
  toHit?: number | null;
  threshold?: number | string;
  toggleClass?: string;
  toggleTitle?: string;
};

export type VehicleSheetContext = {
  cargo: VehicleCargoSection[];
  features: VehicleFeatureSection[];
  itemContext: Record<string, VehicleItemContext>;
  utilities: Utilities<VehicleSheetContext>;
} & ActorSheetContextV1;

export type DerivedDamage = {
  label: string;
  formula: string;
  damageType: string;
  damageHealingTypeLabel: string;
};

export type ActionItem = {
  item: Item5e;
  typeLabel: string;
  calculatedDerivedDamage: DerivedDamage[];
  rangeTitle: string | null;
  rangeSubtitle: string | null;
  containerContents?: ContainerContents;
};

export type ActionSection = {
  actions: ActionItem[];
} & TidySectionBase;

export type ExtensibleComponent = {
  cssClasses: string[];
  dataset: Record<string, string>;
};

export type MessageBus = { message: MessageBusMessage | undefined };

export type MessageBusMessage =
  | {
      tabId: string;
      message: typeof CONSTANTS.MESSAGE_BUS_EXPAND_ALL;
      options?: { includeInlineToggles?: boolean };
    }
  | {
      tabId: string;
      message: typeof CONSTANTS.MESSAGE_BUS_COLLAPSE_ALL;
      options?: { includeInlineToggles?: boolean };
    };

export type Utilities<TContext> = Record<
  string,
  {
    utilityToolbarCommands?: UtilityToolbarCommandParams<TContext>[];
  }
>;

type ActorSave = {
  isConcentration: boolean;
  label: string;
  abbr: string;
  mod: number;
  sign: string;
};

export type ActorSaves = {
  concentration?: ActorSave;
};

export type EncumbranceContext = {
  value: number;
  max: number;
  pct: number;
  encumbered?: boolean;
  stops?: {
    encumbered: number;
    heavilyEncumbered: number;
  };
};

export type ActorSheetContextV1 = {
  abilities: any;
  actions: ActionSection[];
  activateEditors: (
    node: HTMLElement,
    options?: { bindSecrets?: boolean }
  ) => void;
  actor: Actor5e;
  actorPortraitCommands: RegisteredPortraitMenuCommand[];
  allowEffectsManagement: boolean;
  appId: string;
  biographyHTML: string;
  config: typeof CONFIG.DND5E;
  customActorTraits: RenderableCustomActorTrait[];
  customContent: CustomContent[];
  disableExperience: boolean;
  /**
   * Whether or not the sheet can be edited, regardless of lock/sensitive field settings.
   * When this boolean is `false`, then the sheet is effectively hard locked.
   */
  editable: boolean;
  effects: Record<string, EffectCategory<ActiveEffect5e>>;
  elements: unknown;
  encumbrance?: EncumbranceContext;
  filterData: DocumentFilters;
  filterPins: Record<string, Set<string>>;
  /** The actor has special save-based roll buttons to be situationally rendered to the sheet. */
  hasSpecialSaves?: boolean;
  /**
   * Represents remaining health as a percentage within the range of `0` to `100`.
   *
   * Note: This calculation ignores temp HP / temp HP Max, because the stock 5e sheets count 0 hp (ignoring all temp values) as incapacitated. Tidy 5e sheets carries this principle forward with health percentage calculation.
   */
  healthPercentage: number;
  hp: {
    value: number;
    max: number;
    temp?: number;
    tempmax?: number;
  };
  isCharacter: boolean;
  isNPC: boolean;
  isVehicle: boolean;
  limited: boolean;
  /** All items without a container. */
  items: Item5e[];
  labels: Record<string, any>;
  lockExpChanges: boolean;
  lockHpMaxChanges: boolean;
  /**
   * Item Quantity should be uneditable.
   */
  lockItemQuantity: boolean;
  lockLevelSelector: boolean;
  lockMoneyChanges: boolean;
  lockSensitiveFields: boolean;
  modernRules: boolean;
  movement: {
    primary: string;
    special?: string;
    secondary?: string;
  };
  options: unknown;
  overrides: unknown;
  /**
   * The current user owns the actor.
   */
  owner: boolean;
  saves: ActorSaves;
  rollData: unknown;
  senses: unknown;
  skills: any;
  source: any;
  showLimitedSheet: boolean;
  system: any;
  tabs: Tab[];
  tools: any;
  traits: any;
  /**
   * Tells whether the sheet is unlocked via the Sheet Lock feature. When the sheet lock feature is disabled and the sheet is generally editable, this is always `true`.
   */
  unlocked: boolean;
  useActionsFeature?: boolean;
  useClassicControls: boolean;
  useRoundedPortraitStyle: boolean;
  viewableWarnings: DocumentPreparationWarning[];
  warnings: DocumentPreparationWarning[];
};

export type DocumentPreparationWarning = Partial<{
  message: string;
  link: string;
  type: string;
}>;

export type DropdownListOption = { value: any; text: string };

export type PortraitCharmRadiusClass =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'rounded';

export type ItemLayoutMode = 'grid' | 'list';

export type SheetStats = {
  lastSubmissionTime: Date | null;
};

export type CargoOrCrewItem = { name: string; quantity: number };

export type GetFunctionReturnType<T> = T extends {
  get: () => infer V;
}
  ? V
  : never;

export type SheetTabCacheable = {
  onTabSelected: OnTabSelectedFn;
};

export type OnTabSelectedFn = (tabId: string) => void;

export type SheetExpandedItemsCacheable = {
  onItemToggled: OnItemToggledFn;
};

export type OnItemToggledFn = (
  itemId: string,
  isVisible: boolean,
  location: string
) => void;

export type SearchFilterCacheable = {
  onSearch: OnSearchFn;
};

export type OnSearchFn = (location: string, text: string) => void;

/**
 * A map from location to search criteria.
 */
export type LocationToSearchTextMap = Map<string, string>;

/**
 * A map from key Item ID to a set of locations in the sheet, as specified by the item table row during item toggling.
 */
export type ExpandedItemIdToLocationsMap = Map<string, Set<string>>;

/**
 * A map from key Item ID to pre-fetched chat data.
 */
export type ExpandedItemData = Map<string, ItemChatData>;

export type EffectSummaryData = {
  description: {
    value: string;
  };
};

export type MaxPreparedSpellFormula = {
  label: string;
  value: string;
};

export type ContainerPanelItemContext = {
  container: Item5e;
} & ContainerCapacityContext;

export type ContainerCapacityContext = {
  max: number;
  pct: number;
  value: number;
  units: string;
};

export type RenderableClassicControl<TParams> = {
  component: Component<any>;
  props?: (params: TParams) => Record<string, unknown>;
  visible?: (params: TParams) => boolean;
};

export type AvailableClassLevel = {
  delta: number;
  disabled: boolean;
  level: number;
};

export type DamageModificationData = {
  amount: Record<string, string>;
  bypasses: Set<string>;
};

export type ModificationConsequence = 'benefit' | 'detriment' | 'none';

export type DamageModificationContextEntry = {
  label: string;
  consequence: ModificationConsequence;
  icons?: string[];
};

export type EffectCategory<TEffectContext> = {
  type: string;
  label: string;
  effects: TEffectContext[];
  hidden?: boolean;
  // For enchantment/enchantmentActive/enchantmentInactive
  isEnchantment?: boolean;
  // For suppressed effects
  disabled?: boolean;
  // For suppressed effects
  info?: string[];
};

// TODO: Get the real typings for this
export type ActiveEffect5e = any;

// TODO: Get the real typings for this
export type ActiveEffectContext = {
  id: string;
  name: string;
  img: string;
  disabled: boolean;
  duration: number;
  source: any;
  parent: any;
  parentId: string;
  durationParts: string | string[];
  hasTooltip: boolean;
  uuid: string;
  effect: ActiveEffect5e;
};

export type HTMLElementOrGettable =
  | HTMLElement
  | { get(index: number): HTMLElement };

export type ActorV2 = {
  isOwner: boolean;
  // TODO: Put universal ActorV2 members here.
  uuid: string;
  update(toUpdate: Record<string, unknown>): Promise<ActorV2 | undefined>;
} & {};

// TODO: Deprecate
export type ActorSheetClassicContextV2<TActor = ActorV2> = {
  actor: TActor;
  actorPortraitCommands: RegisteredPortraitMenuCommand[];
  editable: boolean;
  healthPercentage: number;
  modernRules: boolean;
  lockSensitiveFields: boolean;
  unlocked: boolean;
  useRoundedPortraitStyle: boolean;
};

export type GroupableSelectOption = {
  value: string;
  label: string;
  group?: string;
};

/* Quadrone Types */
export type DocumentSheetQuadroneContext<TDocument> = {
  document: TDocument;
  editable: boolean;
  fields: any;
  rootId: string;
  source: any;
  unlocked: boolean;
  user: any;
};

export type ActorSheetQuadroneContext = {
  actor: Actor5e;
  customContent: CustomContent[];
  system: Actor5e['system'];
  tabs: Tab[];
  token: TokenDocument | null;
} & DocumentSheetQuadroneContext<Actor5e>;

export type CharacterSheetQuadroneContext = {
  // TODO: Populate with context data as needed
} & ActorSheetQuadroneContext;

export type NpcSheetQuadroneContext = {
  // TODO: Populate with context data as needed
} & ActorSheetQuadroneContext;

export type GroupSheetQuadroneContext = {
  // TODO: Populate with context data as needed
} & ActorSheetQuadroneContext;

export type VehicleSheetQuadroneContext = {
  // TODO: Populate with context data as needed
} & ActorSheetQuadroneContext;

/* Misc - Svelte */

export type SvelteInputEvent = (
  event: Event & {
    currentTarget: EventTarget & HTMLInputElement;
  }
) => any;
