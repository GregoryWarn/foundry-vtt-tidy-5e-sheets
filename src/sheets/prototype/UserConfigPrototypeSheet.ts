import type { SvelteComponent } from 'svelte';
import SvelteApplicationMixin from './SvelteApplicationMixin';
import UserConfigPrototype from './UserConfigPrototype.svelte';

export default class UserConfigPrototypeSheet extends SvelteApplicationMixin(
  foundry.applications.api.DocumentSheetV2
) {
  constructor(...args: any[]) {
    super(...args);
  }

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    classes: ['user-config-prototype'],
    position: {
      width: '860',
      height: '600',
    },
    // actions: {
    //   releaseCharacter: UserConfigPrototype.#onReleaseCharacter,
    // },
    form: {
      closeOnSubmit: true,
    },
  };

  /** @inheritDoc */
  get title() {
    return `${game.i18n.localize('PLAYERS.ConfigTitle')}: ${
      this.document.name
    }`;
  }

  /** @override */
  async _prepareContext(_options: any) {
    return {
      user: this.document,
      source: this.document.toObject(),
      fields: this.document.schema.fields,
      //   characterWidget: this.#characterChoiceWidget.bind(this),
    };
  }

  createComponent(node: HTMLElement): SvelteComponent {
    return new UserConfigPrototype({
      target: node,
      props: {
        data: this.document.toObject(),
      },
    });
  }

  /**
   * Handle button clicks to release the currently selected character.
   * @param {PointerEvent} event
   */
  //   static #onReleaseCharacter(event) {
  //     event.preventDefault();
  //     const button = event.target;
  //     const fields = button.parentElement;
  //     fields.querySelector("select[name=character]").value = "";
  //     fields.querySelector("img.avatar").remove();
  //     button.remove();
  //     this.setPosition({height: "auto"});
  //   }
}
