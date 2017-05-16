

  <script>
    

    /* Dependencies */

    import $ from 'jquery';

    import Paper from 'paper';

    import Loader from '../loader/loader.vue';
    import Stage from '../stage/stage.vue';
    import Mobile from '../mobile/mobile.vue';

    import Logo from '../../modules/components/logo.vue';

    import Morphing from '../stage/morphing.js';

    import AppStore from './store.js';
    import StageStore from '../stage/store.js';
    import Easter from './easter.json';



    
    /* Component */

    var component = { name: 'app', methods: {} };

    component.data = function () {
      return {
        is: AppStore.is
      };
    };

    component.watch = {};

    component.computed = {
      title: function () {
        return this.$refs.view.title || 'Evan Peuvergne | Webdesigner & Developer';
      }
    };

    component.components = { Mobile, Loader, Stage, Logo };


    

    /* Hooks */

    component.created = function () {

      this.$favicon = document.querySelector("link[rel*='icon']");   

    };

    component.mounted = function () {

      document.title = this.title;

      $(window).on('focus', this.focus);
      $(window).on('blur', this.blur);

      this.string = 'none';
      $(window).on('keydown', this.keydown);

      this.easter = new Paper.CompoundPath(Easter.shape);

      this.$events.on('loaded', () => { 
        this.enter();
        this.is.loaded = true;
      });

      this.draw();

    };




    /* Methods */


    // Draw
    
    component.methods.draw = function () {

      this.fitter = new Paper.Rectangle({
        point: [0, sh*.25],
        size: [sw, sh*.6]
      });

      this.easter.fitBounds(this.fitter);

      this.easter.position.x = sw*.5 - this.easter.bounds.width*.5 + 25;
      this.easter.position.y = sh*.5 + 25;
      
      this.easter.children.forEach(c => { 
        c.segments.forEach(s => {
          [s.point, s.handleIn, s.handleOut].forEach(p => {
            p.ox = p.x; p.oy = p.y;
          });
        }); 
      });

    };


    // Events
    
    component.methods.focus = function () {

      this.$favicon.href = "./assets/favicon/here.ico";
      document.title = this.title;

    };
    
    component.methods.blur = function () {

      this.$favicon.href = "./assets/favicon/leaving.ico";
      document.title = 'Don\'t leave pleaseeeee'; 

    };

    component.methods.keydown = function (e) {

      let letter = String.fromCharCode(e.keyCode);
      this.string = this.string.substr(1);
      this.string += letter;
      this.string = this.string.toLowerCase();

      if(_.indexOf(Easter.keywords, this.string) >= 0){

        let morphs = Morphing.generate(StageStore.model, this.easter, { start: 0 });
        
        Morphing.run(new TimelineMax(), StageStore.model, morphs, {
          duration: 0.75, step: 0.01,
        });

      }

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

      //- Mobile
      mobile

      //- Navigation
      nav.app-nav

        //- Logo
        router-link(to="/")
          logo(ref="logo")

        //- Menu
        ul.app-menu(ref="menu")
          li(v-bind:class="{ current: $route.name == 'home' }")
            router-link(to="/") Works
          li(v-bind:class="{ current: $route.name == 'about' }")
            router-link(to="about") About

      //- Stage
      stage(ref="stage")

      //- View
      loader(ref="loader")

      transition(:duration="1000")
        router-view(ref="view")

  </template>


  <style lang="stylus" src="../shared.styl"></style>
  
  <style lang="stylus" scoped>

    .mobile
      position fixed
      z-index 2000
      top 0
      left 0
      right 0
      bottom 0

    
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
        transition color 0.3s ease

        &.current
          color rgba(#000, 0.75)

        &:hover
        &.current:hover
          color rgba(#fefefe, 0.85)

      a
        display block
        padding 1em
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