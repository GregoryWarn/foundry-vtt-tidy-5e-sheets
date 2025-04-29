import { settings } from 'src/settings/settings.svelte';
import { applyThemeToApplication } from 'src/utils/applications.svelte';
import { debug, error } from 'src/utils/logging';
import { type RenderedSheetPart } from 'src/sheets/CustomContentRendererV2';
import type {
  ApplicationRenderOptions,
  ApplicationClosingOptions,
  ApplicationConfiguration,
} from 'src/types/application.types';
import { unmount } from 'svelte';
import { CoarseReactivityProvider } from 'src/features/reactivity/CoarseReactivityProvider.svelte';

export type RenderResult<TContext> = {
  customContents: RenderedSheetPart[];
  context: TContext;
};

const HEADER_CONTROLS_DROPDOWN_SELECTOR = '.controls-dropdown';
const HEADER_CONTROLS_DROPDOWN_EXPANDED_SELECTOR = '.expanded';
const HEADER_CONTROLS_DROPDOWN_TOGGLE_SELECTOR =
  '[data-action="toggleControls"]';

/**
 * A context-oriented Svelte mixin to provide Application V2 windows with Svelte integration.
 *
 * @param BaseApplication the application which should adopt this mixin functionality.
 * @returns the resulting application with this mixin functionality applied.
 */
export function SvelteApplicationMixin<
  TConstructorArgs extends Partial<ApplicationConfiguration> | undefined,
  TContext extends any = {}
>(BaseApplication: any) {
  class SvelteApplication extends BaseApplication {
    constructor(args?: TConstructorArgs) {
      super(args);
    }

    /** The component which represents the UI. */
    #components: Record<string, any>[] = [];

    /**
     * Compatibility shim from Application V1.
     */
    get object() {
      return this.document;
    }

    get windowContent() {
      return this.hasFrame
        ? this.element.querySelector('.window-content')
        : this.element;
    }

    /* -------------------------------------------- */
    /*  Svelte-specific                             */
    /* -------------------------------------------- */

    /**
     * The context store which underpins the application Svelte component.
     * This store is made available as Svelte context to the component
     * and can be retrieved from any child component within.
     */
    _context = new CoarseReactivityProvider<TContext | undefined>(undefined);

    /** Creates the component which represents the window content area. */
    _createComponent(node: HTMLElement): Record<string, any> {
      const errorMessage =
        'Unable to render Svelte application. To implement a Svelte application, override _createComponent and provide context data matching the specified sheet context type.';
      throw new Error(errorMessage);
    }

    _createAdditionalComponents(content: HTMLElement): Record<string, any>[] {
      return [];
    }

    /**
     * Allows for configuring any effects related to the sheet.
     */
    _configureEffects(): void {}

    /* -------------------------------------------- */
    /*  Rendering                                   */
    /* -------------------------------------------- */

    /**
     * Prepares context data which matches the request data type.
     * It is intentionally anemic to provide intellisense until the author can add sufficient additional typings for Application V2.
     */
    async _prepareContext(
      options: ApplicationRenderOptions
    ): Promise<TContext> {
      return await super._prepareContext(options);
    }

    /**
     * Triggers possible reactive rendering by updating the application store
     * with the latest context data.
     *
     * Renders non-Svelte sheet parts in preparation for injecting custom content during the HTML replacement phase.
     *
     * @returns any non-Svelte sheet parts that need to be rendered to the sheet.
     */
    async _renderHTML(
      context: TContext,
      options: ApplicationRenderOptions
    ): Promise<RenderResult<TContext>> {
      this._context.data = context;

      if (options.isFirstRender) {
        const content = this.windowContent;
        this.#components.push(this._createComponent(content));
        this.#components.push(...this._createAdditionalComponents(content));
      }

      return {
        context: context,
        customContents: [],
      };
    }

    _replaceHTML(
      _result: RenderResult<TContext>,
      _content: HTMLElement,
      _options: ApplicationRenderOptions
    ) {
      // Stop it here so the underlying App V2 code doesn't insert `result` "beforeend"
    }

    /* -------------------------------------------- */
    /*  Closing                                     */
    /* -------------------------------------------- */

    async close(options: ApplicationClosingOptions = {}) {
      this._effectCleanup?.();

      await super.close(options);
    }

    _tearDown(options: ApplicationClosingOptions = {}) {
      this.#components.forEach((c) => unmount(c));
      this.#components = [];

      super._tearDown(options);
    }

    async render(options = {}, _options = {}) {
      try {
        // TODO: remove these shallow copies when either Foundry or dnd5e releases the fix. Reference: https://github.com/kgar/foundry-vtt-tidy-5e-sheets/issues/997
        options = typeof options === 'object' ? { ...options } : options;
        _options = { ..._options };
        return super.render(options, _options);
      } catch (e) {
        error('An error occurred while rendering a Tidy application', false, e);
        return super.render(options, _options);
      }
    }

    /* -------------------------------------------- */
    /*  Event Listeners and Handlers                */
    /* -------------------------------------------- */
    _effectCleanup?: () => void;

    _runFrameListenerEffect() {
      applyThemeToApplication(settings.value, this.element);
    }

    _attachFrameListeners() {
      super._attachFrameListeners();

      try {
        // Manage application effects
        this._effectCleanup?.();
        this._effectCleanup = $effect.root(() => {
          this._configureEffects();

          $effect(() => {
            this._runFrameListenerEffect();
          });
        });

        // If a controls dropdown button is clicked, close the controls dropdown.
        this.element.addEventListener('click', (ev: MouseEvent) => {
          const target = ev.target;
          if (!(target instanceof HTMLElement)) {
            return;
          }

          if (target.closest(`${HEADER_CONTROLS_DROPDOWN_SELECTOR} button`)) {
            this.toggleControls(false);
          }
        });
        this.element
          .querySelector(HEADER_CONTROLS_DROPDOWN_SELECTOR)
          ?.addEventListener(
            'focusout',
            (
              ev: FocusEvent & {
                currentTarget: HTMLElement;
                relatedTarget?: HTMLElement;
              }
            ) => {
              if (
                ev.relatedTarget?.closest(
                  `${HEADER_CONTROLS_DROPDOWN_SELECTOR}, ${HEADER_CONTROLS_DROPDOWN_TOGGLE_SELECTOR}`
                )
              ) {
                return;
              }

              if (
                !ev.currentTarget.matches(
                  HEADER_CONTROLS_DROPDOWN_EXPANDED_SELECTOR
                )
              ) {
                return;
              }

              this.toggleControls(false);
            },
            {}
          );
      } catch (e) {
        error(
          'An error occurred while attaching frame listeners for the application.',
          false,
          { error: e, sheet: this }
        );
      }
    }

    /**
     * Augments the base toggleControls with handling for closing menu when focus is lost.
     */
    toggleControls(expanded: boolean | undefined) {
      super.toggleControls(expanded, { animate: false });

      const controlsDropdown = this.element.querySelector(
        HEADER_CONTROLS_DROPDOWN_SELECTOR
      );
      const menuIsExpanded = controlsDropdown?.matches(
        HEADER_CONTROLS_DROPDOWN_EXPANDED_SELECTOR
      );
      if (menuIsExpanded) {
        debug('App V2 - On Menu Opened');
        controlsDropdown.tabIndex = 0;
        controlsDropdown.focus();
      } else if (controlsDropdown) {
        debug('App V2 - On Menu Closed');
        controlsDropdown.blur();
        controlsDropdown.tabIndex = -1;
      }
    }
  }

  return SvelteApplication;
}
