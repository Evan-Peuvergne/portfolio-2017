



  /**
  *
  *   MAIN | Js
  *
  *   Desc : app global behavior definition
  *   Location : > main.js
  *
  */
  


  



  /* Dependencies */

  import { TimelineMax } from 'gsap';

  import Vue from 'vue';
  import Router from 'vue-router';

  import App from './app.vue';

  import { routes } from './routes.js';

  

  /* Global */

  window.sw = window.innerWidth;
  window.sh = window.innerHeight;

  window.ease = {};
  window.ease.elastic = Elastic.easeOut.config(1, 0.8);
  window.ease.default = Power2.easeOut;

  window.tracker = {};
  window.tracker.r = window.sh/12;
  window.tracker.d = window.tracker.r*2;
  window.tracker.s = window.tracker.d*1.3;
  window.tracker.p = 50;
  window.tracker.distorsion = { f: 0.3, a: 0.3 };

  window.shade = {};
  window.shade.p = 100;

  
  /* Router */

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

  app.$mount('#app');
  
  