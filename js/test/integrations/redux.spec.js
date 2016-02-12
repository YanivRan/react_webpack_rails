import expect, { spyOn } from 'expect';
import { createStore } from 'redux'
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

import subject from '../../src/integrations/redux';

class AppContainer extends React.Component {
  render() {
    return <div>AppContainer</div>;
  }
}

const fakeReducer = function() {};
const validStore = function(initialState) {
  return createStore(fakeReducer, initialState)
};

describe('ReduxIntegration', function () {
  afterEach(function() {
    subject.stores = {};
    subject.mountedStores = {};
    subject.containers = {};
    expect.restoreSpies();
  });

  describe('.constructor', function() {
    it('intializes empty stores, mountedStores and containers dictionaries', function () {
      expect(subject.stores).toEqual({});
      expect(subject.mountedStores).toEqual({});
      expect(subject.containers).toEqual({});
    });
  });

  describe('#registerStore', function() {
    it('throws an error', function() {
      expect(function() {
        const invalidStore = {};
        subject.registerStore('InvalidStore', invalidStore);
      })
      .toThrow(/Error when registering 'InvalidStore' store: must be a function./);
    });

    it('adds valid store to the storage', function() {
      subject.registerStore('ValidStore', validStore);

      expect(subject.stores.ValidStore).toBe(validStore);
    });
  });

  describe('#mountStore', function() {
    it('throws an error when store is not a function', function(){
      expect(function() {
        subject.mountStore('InvalidStore', {});
      })
      .toThrow(/Error when mounting 'InvalidStore' store: must be a function./);
    });

    it('throws an error when store does not returns valid object', function(){
      subject.registerStore('InvalidStore', function() { return 'store' });
      expect(function() {
        subject.mountStore('InvalidStore', {});
      })
      .toThrow(/Error when mounting 'InvalidStore' store: must be a valid Redux store./);
    });

    it('ads store to mountedStores storage', function() {
      subject.registerStore('ValidStore', validStore);
      const initialState = {};
      subject.mountStore('ValidStore', initialState);

      expect(subject.mountedStores.ValidStore).toEqual(validStore(initialState));
    });
  });

  describe('#getStore', function() {
    it('returns undefined if store is not found', function() {
      expect(subject.getStore('FakeStore')).toBe(undefined);
    });

    it('returns store by name from mountedStores storage', function() {
      subject.registerStore('ValidStore', validStore);
      subject.mountStore('ValidStore', {});
      expect(subject.getStore('ValidStore')).toEqual(validStore({}));
    });
  });

  describe('#registerContainer', function() {
    it('adds container to the storage', function() {
      subject.registerContainer('AppContainer', AppContainer);

      expect(subject.containers.AppContainer).toEqual(AppContainer);
    });
  });

  describe('#getContainer', function() {
    it('returns container by name', function() {
      subject.registerContainer('AppContainer', AppContainer);
      expect(subject.getContainer('AppContainer')).toEqual(AppContainer);
    });
  });

  describe('#createContainer', function () {
    it('creates redux container', function() {
      subject.registerContainer('AppContainer', AppContainer);
      const container = subject.createContainer('AppContainer');

      expect(React.isValidElement(container)).toBe(true);
      expect(container.type).toBe(AppContainer);
    });
  });

  describe('#createRootComponent', function() {
    it('creates redux root component', function() {
      subject.registerStore('ValidStore', validStore);
      const initialState = { fake: 'state' };
      subject.mountStore('ValidStore', initialState);
      subject.registerContainer('AppContainer', AppContainer);
      const rootComponent = subject.createRootComponent('AppContainer', 'ValidStore');

      expect(React.isValidElement(rootComponent)).toBe(true);
    });
  });

  describe('#renderContainer', function() {
    it('calls #createRootComponent and ReactDOM.render functions', function() {
      const subjectSpy = spyOn(subject, 'createRootComponent');
      const reactSpy = spyOn(ReactDOM, 'render');

      subject.renderContainer('ContainerName', 'node', 'StoreName');

      expect(subjectSpy.calls.length).toEqual(1);
      expect(subjectSpy).toHaveBeenCalledWith('ContainerName', 'StoreName');
      expect(reactSpy.calls.length).toEqual(1);
    });
  });

  describe('#unmountContainer', function() {
    const node = { nodeType: 1, nodeName: 'DIV' };
    const unmountSpy = spyOn(ReactDOM, 'unmountComponentAtNode');

    subject.unmountContainer(node);

    expect(unmountSpy.calls.length).toEqual(1);
    expect(unmountSpy).toHaveBeenCalledWith(node);
  });

  describe('#renderContainerToString', function() {
    it('calls #createRootComponent and ReactDOM.renderToString', function() {
      const subjectSpy = spyOn(subject, 'createRootComponent');
      const reactSpy = spyOn(ReactDOMServer, 'renderToString');

      subject.renderContainerToString('ContainerName', 'StoreName');

      expect(subjectSpy.calls.length).toEqual(1);
      expect(subjectSpy).toHaveBeenCalledWith('ContainerName', 'StoreName');
      expect(reactSpy.calls.length).toEqual(1);
    });
  });

  describe('#storeIntegrationWrapper.mount', function() {
    it('calls #mountStore function', function() {
      const mountStoreSpy = spyOn(subject, 'mountStore');
      const payload = { name: 'StoreName', props: { fake: 'props' } };

      subject.storeIntegrationWrapper.mount('', payload)

      expect(mountStoreSpy.calls.length).toEqual(1);
      expect(mountStoreSpy).toHaveBeenCalledWith(payload.name, payload.props);
    });
  });
});
