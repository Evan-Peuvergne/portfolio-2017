



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
  window.ease.elastic = Elastic.easeOut.config(1, 0.9);
  window.ease.default = Power2.easeOut;

  
  /* Router */

  Vue.use(Router);

  const routing = new Router({
    routes: routes
  });


  
  /* App */

  const app = new Vue({
    router: routing,
    render: h => h(App) 
  });

  app.$mount('#app');
  
  