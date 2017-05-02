

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

    component.watch = {
      '$route': function (to, from) {
        _.defer(() => { 

          let dest = _.head(to.matched).instances.default;
          if(dest && dest.enter){ dest.enter(); }

          let origin = _.head(from.matched).instances.default;
          if(origin && origin.leave){ origin.leave(); }

        });
      }
    }

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

      this.$events.on('loaded', this.enter);

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


    // Transitions
    
    component.methods.enter = function () {

      let timeline = new TimelineMax();

      timeline.fromTo(this.$refs.logo.$el, .7, 
        { y: -150, opacity: 0, visibility: 'visible' },
        { y: 0, opacity: 1, ease: ease.elashard, });

      timeline.set(this.$refs.menu, { visibility: 'visible' }, 0.1);
      timeline.staggerFromTo(this.$refs.menu.children, .7, 
        { y: -150, opacity: 0 },
        { y: 0, opacity: 1, ease: ease.elashard, }, 0.1, 0.1);

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
        logo(ref="logo")

        //- Menu
        ul.app-menu(ref="menu")
          li.current
            router-link(to="/") Works
          li
            router-link(to="about") About

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
        visibility hidden
        margin 0 2em 0 0

    .app-menu
      display block
      visibility hidden
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