


  /* Dependencies */

  import { TimelineMax } from 'gsap';

  import Vue from 'vue';
  import Router from 'vue-router';
  import Events from 'vue-events';

  import App from './shared/app.vue';

  import { routes } from './routes.js';

  

  /* Global */

  window.sw = window.innerWidth;
  window.sh = window.innerHeight;

  window.ease = {};
  window.ease.elastic = Elastic.easeOut.config(.8, .8);
  window.ease.elasoft = Elastic.easeOut.config(.8, .8);
  window.ease.elashard = Elastic.easeOut.config(.8, .65);
  window.ease.default = Power2.easeOut;

  window.tracker = {};
  window.tracker.r = window.sh/12;
  window.tracker.d = window.tracker.r*2;
  window.tracker.s = window.tracker.d*1.3;
  window.tracker.p = 50;
  window.tracker.distorsion = { f: 0.02, a: 1 };

  window.nav = {};
  window.nav.r = window.sh*0.085;

  window.shade = {};
  window.shade.p = { x:75, y: 75 };

  window.titles = {};
  window.titles.p = { x: 20, y: 20 };
  window.titles.lp = { x: 5, y: 5 };
  window.titles.hp = { x: 8, y: 8 };

  window.onresize = function () {

    window.sw = window.innerWidth;
    window.sh = window.innerHeight;

    window.tracker.r = window.sh/12;
    window.tracker.d = window.tracker.r*2;
    window.tracker.s = window.tracker.d*1.3;

  };

  
  
  /* Plugins */


  // Events
  
  Vue.use(Events);


  // Router

  Vue.use(Router);

  const routing = new Router({
    routes: routes,
    mode: 'history'
  });


  
  /* App */

  const app = new Vue({
    router: routing,
    render: h => h(App) 
  });

  window.app = app;

  app.$mount('#app');
  
  