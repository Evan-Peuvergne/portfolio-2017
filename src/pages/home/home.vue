

  <script>

    
    /* Dependencies */

    import $ from 'jquery';
    import { TimelineMax } from 'gsap';
    
    import Infos from './infos.vue';
    import Background from './background/background.vue';

    import Projects from './projects.json';
    import S from '../../shared/helpers/sizes.js';


    
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

    component.components = {
      Infos,
      Background
    };


    // Init
    
    component.mounted = function () {

      // Properties
      this.is = { navigating: false, };

      // Navigation
      $(this.$refs.next).on('click', (e) => {
        e.preventDefault(); this.next();
      });

      $(this.$refs.previous).on('click', (e) => {
        e.preventDefault(); this.previous();
      });

      $(window).on('mousemove', (e) => {
        this.mouse.abs.x = e.clientX;
        this.mouse.abs.y = e.clientY;
        this.mouse.orth.x = e.clientX/sw - .5;
        this.mouse.orth.y = e.clientY/sh - .5;
      });
      
      // Keyboard
      $(window).on('keydown', (e) => {
        switch(e.keyCode) {
          case 37: this.previous(); break;
          case 39: this.next(); break;
        }
      });

      this.$events.on('home.navigation', (e) => {
        if(e.direction == 'next'){ this.next(); }
        else{ this.previous(); }
      });

    }

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
      setTimeout(() => { this.is.navigating = false; }, 1500);
      
      this.current = (this.current+1)%Projects.length;

    };



    /* Export */

    export default component;

  </script>


  <template lang="jade">
      
    .home
      //- a.home-navigation.home-next(href="#", ref="next")
      //- a.home-navigation.home-previous(href="#", ref="previous")

      infos(v-bind:current="current", v-bind:content="content")
      background(v-bind:current="current", v-bind:content="content", v-bind:mouse="mouse")

      div.home-accessMessage
        p
          | Let's
          a(v-bind:href="url", v-bind:style="{ color: color, borderColor: color }" target="_blank") Launch
          | the project

  </template>


  <style lang="stylus">
    
    .home
      position absolute
      top 0
      left 0
      width 100%
      height 100%

    .home-infos
    .home-background
      position absolute

    .home-infos
      z-index 200

    .home-background
      z-index 100

    .home-accessMessage
      display block
      position absolute
      z-index 500
      bottom 2em
      left 0
      width 100%
      text-align center
      
      p
        display inline-block
        vertical-align middle
        font-family Gotham Bold
        font-size 0.75em
        color rgba(#000, 0.3)
        letter-spacing 0.15em
        text-align center
        text-transform uppercase

        a
          display inline-block
          vertical-align middle
          font-size 0.9em
          color #000000
          letter-spacing 0.2em
          line-height 1
          text-decoration none
          padding 0.7em 0.6em 0.6em 0.8em
          border 2px solid #000000
          margin 0 1em
          transform translate3d(0, -5%, 0)
          transition color 0.3s ease, border-color 0.3s ease

          &:hover
            color rgba(#fefefe, 0.8) !important
            border-color rgba(#fefefe, 0.8) !important

  </style>
  