export const DirewolfNodeMixin = Base => class DirewolfNodeMixin extends Base {

  static get isDirewolfNode() {
    return true;
  }

  static get properties() {
    return {
      /**
       * The global state object that is shared amongst all Direwolf nodes.
       */
      _globalState: {
        type: Object
      },
      /**
       * The shared state object that is shared amongst all local and remote instances of this class.
       */
      _sharedState: {
        type: Object
      }
    };
  }

  set direwolfSpace(value) {
    this._direwolfSpace = value;
  }

  get direwolfSpace() {
    return this._direwolfSpace;
  }

  set globalState(value) {
    if (value) {
      this._globalState = value;
      this._globalState.observe(this.handleGlobalStateChanged.bind(this));

      this.globalStateAvailable(this._globalState);
    }
  }

  get globalState() {
    return this._globalState;
  }

  globalStateAvailable(globalState) {
    // to be overridden
  }

  handleGlobalStateChanged(event) {
  }

  set sharedState(value) {
    if (value) {
      this._sharedState = value;
      this._sharedState.observe(this.handleSharedStateChanged.bind(this));

      this.sharedStateAvailable(this._sharedState);
    }
  }

  get sharedState() {
    return this._sharedState;
  }

  sharedStateAvailable(sharedState) {
    // to be overridden
  }

  handleSharedStateChanged(event) {
  }

  fireDirewolfChange() {
    this.dispatchEvent(new CustomEvent('direwolf-node-changed', {bubbles: true}));
  }

}
