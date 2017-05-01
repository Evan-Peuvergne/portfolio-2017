

  <script>
    

    /* Dependencies */

    import $ from 'jquery';

    import Paper from 'paper';

    import Loader from './loader/loader.vue';
    import Stage from './stage/stage.vue';

    import Logo from '../modules/components/logo.vue';



    
    /* Component */

    var component = { name: 'app', methods: {} };

    component.data = function () {
      return {};
    };

    component.computed = {
      title: function () {
        return this.$refs.view.title || 'Evan Peuvergne | Webdesigner & Developer';
      }
    };

    component.components = { Loader, Stage, Logo };


    

    /* Hooks */

    component.created = function () {

      this.$favicon = document.querySelector("link[rel*='icon']");      

    };

    component.mounted = function () {

      document.title = this.title;

      $(window).on('focus', this.focus);
      $(window).on('blur', this.blur);

    };




    /* Methods */


    // Events
    
    component.methods.focus = function () {

      this.$favicon.href="./assets/favicon/here.ico";
      document.title = this.title;

    };
    
    component.methods.blur = function () {

      this.$favicon.href="./assets/favicon/leaving.ico";
      document.title = 'Don\'t leave pleaseeeee'; 

    };





    /* Export */

    export default component;


  </script>


  <template lang="jade">
    
    //- Root
    .app

      //- Navigation
      nav.app-nav

        //- Logo
        logo(ref="")

        //- Menu
        ul.app-menu
          li.current
            a(href="#") Works
          li
            a(href="#") About

      //- Stage
      stage(ref="stage")

      //- View
      loader(ref="loader")
      router-view(ref="view")

  </template>


  <style lang="stylus" src="./shared.styl"></style>
  
  <style lang="stylus" scoped>
    
    nav-offset = 3em

    .app-nav
      display flex
      align-items center
      position absolute
      z-index 1800
      top nav-offset
      left nav-offset
      right nav-offset

      .logo
        margin 0 1.5em 0 0

    .app-menu
      font-family Gotham Bold
      font-size 0.9em
      color rgba(#000, 0.3)
      padding 0.2em 0 0 0

      li
        display inline-block
        vertical-align middle
        padding 1em
        transition color 0.3s ease

        &.current
          color rgba(#000, 0.75)

        &:hover
        &.current:hover
          color rgba(#fefefe, 0.85)

      a
        color inherit
        text-decoration none
    
    .stage
    .loader
      display block
      position absolute
      top 0
      left 0
      width 100%
      height 100%

    .stage
      z-index 1100

    .loader
      z-index 1000

  </style>