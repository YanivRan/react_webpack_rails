import reactIntegration from './integrations/react';

class IntegrationsManager {
  constructor() {
    this.integrations = {
      'react-component': reactIntegration.integrationWrapper,
    };
  }

  get(name) {
    // handle missing one here;
    return this.integrations[name];
  }

  register(name, integration) {
    this.integrations[name] = integration;
  }
}

export default new IntegrationsManager;
