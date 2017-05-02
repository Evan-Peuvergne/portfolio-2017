



  /**
  *
  *   ROUTES | Js
  *
  *   Desc : defines routes shemes and components to associate
  *   Location : > routes.js
  *
  */
 


  /* Dependencies */  

  import Home from './pages/home/home.vue';
  import About from './pages/about/about.vue';



  /* Config */

  export const routes = [
    {
      path: '/',
      component: Home,
      name: 'home'
    },
    {
      path: '/about',
      component: About,
      name: 'about'
    }
  ];
  