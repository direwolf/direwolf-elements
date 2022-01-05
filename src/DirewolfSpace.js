import { html, css, LitElement } from 'lit';
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

/**
 * `direwolf-space`
 *
 *
 * @customElement direwolf-space
 * @demo demo/index.html
 */
export class DirewolfSpace extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `;
  }

  static get properties() {
    return {
      /**
       * Use `space` to tell the element the ID of the DireWolf space it should connect to.
       */
      space: {
        type: String,
        reflect: true
      },
      server: {
        type: String,
        reflect: true
      },
      /**
       * The global state object that is shared amongst all Direwolf nodes.
       */
      _globalState: {
        type: Object
      },
      _sharedStates: {
        type: Object,
        observer: '_sharedStatesChanged'
      },
    };
  }

  constructor() {
    super();
    this.server = 'ws://localhost:1234';
  }

  render() {
    return html`
      <slot id="slot"></slot>
    `;
  }

  updated(changedProperties) {
    if (changedProperties) {
      if (changedProperties.has('space')) {
        this._connectYjs(this.space);
      }
    }
  }

  firstUpdated(changedProperties) {
    this.addEventListener('direwolf-node-changed', e => {
      if (this._globalState) {
        this._globalStateChanged(this._globalState);
      }
      if (this._sharedStates) {
        this._bindChildrenSharedStates();
      }
    });
  }

  get sharedStates() {
    return this._sharedStates;
  }

  /**
   * Connects to the specified Yjs room.
   *
   * @private
   */
  _connectYjs(room) {
    console.log('connecting to ' + room);

    const doc = new Y.Doc()
    const wsProvider = new WebsocketProvider(this.server, room, doc)

    wsProvider.on('status', event => {
      console.log(event.status) // logs "connected" or "disconnected"
    });

    wsProvider.on('sync', event => {
      // initialize global state
      const globalStateMap = doc.getMap('globalState');
      globalStateMap.observe(this._observeGlobalState.bind(this));
      this._globalState = globalStateMap;
      this._globalStateChanged(globalStateMap);

      // initialize shared state map
      const sharedStatesMap = doc.getMap('sharedStates');
      this._sharedStates = sharedStatesMap;
      this._bindChildrenSharedStates();
    });
  }

  _observeGlobalState(event) {
    //console.log('global state event');
  }

  _globalStateChanged(globalState) {
    var distributedNodes = this.shadowRoot.getElementById('slot').assignedNodes({flatten: true});

    distributedNodes.forEach(node => {
      if (node.constructor.isDirewolfNode) {
        node.direwolfSpace = this;
        node.globalState = globalState;
      }
      // now query the grandchildren
      if (node.hasChildNodes()) {
        let children = [...node.getElementsByTagName('*')];
        children.forEach(childnode => {
          if (childnode.constructor.isDirewolfNode) {
            childnode.direwolfSpace = this;
            childnode.globalState = globalState;
          }
        });
      }
    });
  }

  _bindChildrenSharedStates() {
    const distributedNodes = this.shadowRoot.getElementById('slot').assignedNodes({flatten: true});

    distributedNodes.forEach(node => {
      if (node.constructor.isDirewolfNode) {
        const sharedState = this._sharedStates.set(this.getFreshId(), new Y.Map());
        node.sharedState = sharedState;
      }
      // now query the grandchildren
      if (node.hasChildNodes()) {
        let children = [...node.getElementsByTagName('*')];
        children.forEach(childnode => {
          if (childnode.constructor.isDirewolfNode) {
            let sharedState = this._sharedStates.set(this.getFreshId(), new Y.Map());
            childnode.sharedState = sharedState;
          }
        });
      }
    });
  }

  updateBindings() {
    if (this._globalState) {
      this._globalStateChanged(this._globalState);
    }
    if (this._sharedStates) {
      this._bindChildrenSharedStates();
    }
  }

  getFreshId() {
    // Credits to https://stackoverflow.com/a/2117523/7248033
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }
}
