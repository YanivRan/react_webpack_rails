RWR.react = {
  components: {},
  registerComponent: function _registerComponent(name, component) {
    RWR.react.components[name] = component;
  },

  getComponent: function _getComponent(name) {
    return RWR.react.components[name];
  },

  createComponent: function _createComponent(name, props) {
    var constructor = RWR.getComponent(name);
    return React.createElement(constructor, props);
  },

  renderComponent: function _renderComponent(name, props, node) {
    var component = RWR.createComponent(name, props);
    RWR.reactDOM().render(component, node);
  },

  unmountComponent: function _unmountComponent(node) {
    RWR.reactDOM().unmountComponentAtNode(node);
  },
};

RWR.registerComponent = RWR.react.registerComponent;
RWR.getComponent = RWR.react.getComponent;
RWR.createComponent = RWR.react.createComponent;
RWR.renderComponent = RWR.react.renderComponent;
RWR.unmountComponent = RWR.react.unmountComponent;

RWR.integrations['react-component'] = {
  mount: function _renderComponentWrapper(config, options) {
    RWR.renderComponent(options.name, config.payload, config.node);
  },

  unmount: function _unmountComponentWrapper(config) {
    RWR.unmountComponent(config.node);
  },
};

function _depricatedReactHelperWarn(helperName) {
  console.warn(RWR._messages.warnings.deprication(helperName, 'Use RWR.' + helperName + ' instead.'));
}

function registerComponent() {
  _depricatedReactHelperWarn('registerComponent');
  RWR.registerComponent.apply(null, arguments);
}

function getComponent() {
  _depricatedReactHelperWarn('getComponent');
  RWR.getComponent.apply(null, arguments);
}

function createComponent() {
  _depricatedReactHelperWarn('createComponent');
  RWR.createComponent.apply(null, arguments);
}

function renderComponent() {
  _depricatedReactHelperWarn('renderComponent');
  RWR.renderComponent.apply(null, arguments);
}

function unmountComponent() {
  _depricatedReactHelperWarn('unmountComponent');
  RWR.unmountComponent.apply(null, arguments);
}
