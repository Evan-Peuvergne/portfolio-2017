

  <script>
    

    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';



    
    /* Component */

    var component = { name: 'logo', methods: {} };

    component.data = function () {
      return {};
    };

    component.components = {};


    

    /* Hooks */

    component.created = function () {

            

    };

    component.mounted = function () {

      

    };




    /* Methods */


    // Events
    
    





    /* Export */

    export default component;


  </script>


  <template lang="jade">
    
    //- Root
    a.logo

      //- Container
      div.logo-container
        span
        span
        span

  </template>

  
  <style lang="stylus" scoped>

    logo-width = 30px
    logo-height = 21px
  
    logo-bar-size = 3px
    logo-bar-gutter = (logo-height - 3*logo-bar-size)/2

    .logo
    .logo-container
      display block
      position relative
      width logo-width
      height logo-height

    .logo-container
      overflow hidden

    .logo
      
      span
        display block
        position absolute
        left 0
        width 30px
        height logo-bar-size
        border-radius 2px
        background-color rgba(#000, 0.2)
        transition background-color 0.5s ease

      for i in (1..3)
        span:nth-child({i})
          top (i - 1) * (logo-bar-size + logo-bar-gutter)
          animation-delay i * 0.1s !important

      span:nth-child(2)
        width 25px

    .logo:hover
      span
        background-color rgba(#fefefe, 0.85)

    .logo:hover
      span
        animation LogoHover 0.3s ease
        animation-fill-mode both

    .logo::after
      display block
      content ''
      position absolute
      z-index -1
      top -2em
      left -2em
      right -2em
      bottom -2em


    @keyframes LogoHover{

      0%{ transform: translate3d(0, 0, 0); }
      50%{ transform: translate3d(logo-width, 0, 0); }
      51%{ transform: translate3d(-3*logo-width, 0, 0); }
      100%{ transform: translate3d(0, 0, 0); }

    }

  </style>