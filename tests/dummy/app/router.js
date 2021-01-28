import AddonDocsRouter, { docsRoute } from 'ember-cli-addon-docs/router';
import config from './config/environment';

const Router = AddonDocsRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function() {
  docsRoute(this, function() {
    this.route('bar-charts');
    this.route('line-charts');
    this.route('area-charts');
    this.route('scatter-plot');
    this.route('bubble-chart');
    this.route('sunburst');
    this.route('sankey');
    this.route('parallel-coordinates');
  });
});

export default Router;
