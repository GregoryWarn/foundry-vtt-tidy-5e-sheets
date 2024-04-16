import type { SvelteComponent } from 'svelte';

export default function SvelteApplicationMixin<
  T extends new (...args: any[]) => {} & any
>(BaseApplication: T) {
  abstract class SvelteApplication extends BaseApplication {
    // TODO: implement `_renderFrame` and other Svelte Application Base pieces derived from src\applications\SvelteFormApplicationBase.ts

    svelteRoot?: SvelteComponent;

    abstract createComponent(node: HTMLElement): SvelteComponent;

    async _renderFrame(options: any): Promise<HTMLElement> {
      const element = await super._renderFrame(options);
      const target = this.hasFrame
        ? element.querySelector('.window-content')
        : element;
      this.svelteRoot = this.createComponent(target);
      return element;
    }

    async _renderHTML(context: any, options: any) {
      console.log({ context, options });
    }

    _replaceHTML(result: any, content: any, options: any) {
      console.log({ result, content, options });
    }
  }

  return SvelteApplication;
}

/*
Notes:
    - https://discord.com/channels/170995199584108546/1209623497664364614/1210965650621861939
    
Sample React code and advice:
```js
class ReactAppV2 extends foundry.applications.api.ApplicationV2 {
  static DEFAULT_OPTIONS = {...}

  reactRoot;

  async _renderFrame(options) {
    const element = super._renderFrame(options);
    const target = this.hasFrame ? element.querySelector(".window-content") : element;
    this.reactRoot = createRoot(target);
    return element;
  }

  async _renderHTML(context, options) {
    this.reactRoot.render(...); // Probably depends on context
  }
}
```

`_renderFrame` only occurs once and is the most natural point (given the current API) to bind the content div to your react component.

`_renderHTML` is the semantically appropriate place to render updates to the HTML of the app. You're possibly a little bit concerned about the expected return value here, but I think it's a documentation issue. You only need to return something in _renderHTML if you are using that returned value in _replaceHTML. 
Two documentation changes I'll make based on your example:

The return type of `_renderHTML` should be Promise<any>
`_replaceHTML` is no longer @abstract but rather only @protected
Furthermore, my advice would be to implement React functionality as a mixin rather than as a base class. The goal will be to be able to augment a base class with a different rendering backend. For example, you might want to have MyActorSheet1 extends HandlebarsMixin(ActorSheet) and MyActorSheet2 extends ReactMixin(ActorSheet) and MyActorSheet3 extends VueMixin(ActorSheet) which all retain shared interfaces and behaviors of the base ActorSheet which is agnostic to how it gets rendered.

So your use case might look like:
`class MySpecificReactApp extends ReactRenderingMixin(ApplicationV2) {...}`

*/
