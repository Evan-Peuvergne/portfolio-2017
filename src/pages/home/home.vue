

  <script>

    
    /* Dependencies */

    import $ from 'jquery';
    import { TimelineMax } from 'gsap';

    import Stage from './stage/stage.vue';
    
    // import Infos from './infos.vue';
    // import Background from './background/background.vue';

    import Projects from './projects.json';


    
    /* Component */

    var component = { name: 'home', methods: {} };


    // Properties
    
    component.data = function () {
      return {
        current: 0,
        content: Projects,
        mouse: { 
          abs: { x: sw*.5, y: sh*.5 },
          orth: { x: .5, y: .5 }
        }
      }
    };

    component.computed = {
      url: function () { return this.content[this.current].url; },
      color: function () { return this.content[this.current].color; }
    };

    component.components = { Stage };


    // Init
    
    component.mounted = function () {

      $(window).on('mousemove', this.mousemove);

    }


    // Mouse
    
    component.methods.mousemove = function (e) {

      this.mouse.abs.x = e.clientX;
      this.mouse.abs.y = e.clientY;

      this.mouse.orth.x = e.clientX/sw - .5;
      this.mouse.orth.y = e.clientY/sh - .5;

    };


    // Navigation
    
    component.methods.previous = function () { 

      if(this.is.navigating) { return; }
      this.is.navigating = true;
      setTimeout(() => { this.is.navigating = false; }, 1000);

      let i = this.current-1; 
      this.current = (i >= 0) ? i : Projects.length-1;

    };  
    
    component.methods.next = function () { 

      if(this.is.navigating) { return; }
      this.is.navigating = true;
      setTimeout(() => { this.is.navigating = false; }, 1000);
      
      this.current = (this.current+1)%Projects.length;

    };



    /* Export */

    export default component;

  </script>


  <template lang="jade">
      
    .home

      stage(v-bind:current="current", v-bind:mouse="mouse", v-bind:content="content")

      p.home-accessMessage
        | Maintain clicked or
        a(v-bind:href="url", v-bind:style="{ color: color, borderColor: color }" target="_blank") press
        | to discover

  </template>


  <style lang="stylus" scoped>

    .home
      display block
      position absolute
      top 0
      left 0
      width 100%
      height 100%

    .home-stage
      display block
      position absolute
      top 0
      left 0
      width 100%
      height 100%
    
    .home-accessMessage
      display block
      position absolute
      z-index 500
      bottom 2em
      width 100%
      font-family Gotham Bold
      font-size 0.75em
      color rgba(#000, 0.3)
      letter-spacing 0.075em
      text-transform uppercase
      text-align center

      a
        display inline-block
        vertical-align middle
        font-size 0.9em
        letter-spacing 0.15em
        padding 0.7em 0.7em 0.6em 0.8em
        margin 0 0.8em
        border 2px solid #000000
        text-decoration none
        transition color 0.3s ease, border-color 0.3s ease

        &:hover
          color rgba(#fefefe, 0.8) !important
          border-color rgba(#fefefe, 0.8) !important

  </style>
  