



  /**
  *
  *   MAIN | Js
  *
  *   Desc : app global behavior definition
  *   Location : > main.js
  *
  */
  


  /* Dependencies */

  import Vue from 'vue';
  import App from './app.vue';
  import Router from 'vue-router';

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
  
  