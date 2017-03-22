



  /**
  *
  *   MAIN | Js
  *
  *   Desc : app global behavior definition
  *   Location : > main.js
  *
  */
  


  /* Global */

  window.sw = window.innerWidth;
  window.sh = window.innerHeight;



  /* Dependencies */

  import Vue from 'vue';
  import Router from 'vue-router';

  import App from './app.vue';

  import { routes } from './routes.js';


  
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
  
  