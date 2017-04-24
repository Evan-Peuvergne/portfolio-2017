

  <script>

    
    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';

    import Paper from 'paper';
    import { TimelineMax } from 'gsap';

    import Titles from './titles/titles.vue';

    import StageStore from '../../shared/stage/store.js';
    import Morphing from '../../shared/stage/morphing.js';

    import Projects from '../../shared/projects.json';


    
    /* Component */

    var component = { name: 'home', methods: {} };


    // Properties
    
    component.props = {};
    
    component.data = function () {
      return {
        current: 0,
        prev: 0,
        mouse: { 
          abs: { x: sw*.5, y: sh*.5 },
          orth: { x: .5, y: .5 }
        },
      }
    };

    component.computed = {};

    component.components = { Titles, };


    // Init
    
    component.created = function () {

      this.shape = StageStore.shape;

      Projects.forEach(p => {
        StageStore.covers.push({
          name: p.id, url: p.cover.url, active: false,
        });
      });

      this.models = [];

      this.timeline = new TimelineMax({
        onComplete: () => {
          Morphing.clear(this.shape, this.models[0]);
        }
      });

    };
    
    component.mounted = function () {

      Projects.forEach(p => {
        this.models.push(new Paper.CompoundPath(p.letter.path));
      });  

      this.draw();

      $(window).on('keydown', this.keydown);

      this.$events.on('loaded', this.enter);

    };


    // Draw
    
    component.methods.draw = function () {

      this.models.forEach((m, i) => {

        let settings = Projects[i].letter;
        let fitter = new Paper.Rectangle({
          point: [0, sh*(1-settings.size)/2],
          size: [sw, sh*settings.size]
        });
        m.fitBounds(fitter);

        m.position.x = sw*.5 - m.bounds.width*(1-settings.offset.x) - 25;
        m.position.y = sh*.5 - m.bounds.height*settings.offset.y;

        m.children.forEach(c => { c.segments.forEach(s => {
          [s.point, s.handleIn, s.handleOut].forEach(p => { 
            p.ox = p.x; p.oy = p.y; });
        }); });

      });

    };


    // Animations
    
    component.methods.enter = function () {

      StageStore.sourcing = true;
      StageStore.parallaxing = true;
      StageStore.distording = true;

      let morphs = Morphing.generate(this.shape, this.models[0], { 
        start: 34, 
      });

      Morphing.run(this.timeline, this.shape, morphs, {
        duration: .75,
        step: .01
      });

    };


    // Events
    
    component.methods.keydown = function (e) {

      switch(e.keyCode) {
        case 37: this.previous(); break;
        case 39 : this.next(); break;
      }

    };


    // Navigation
    
    component.methods.go = function (i) {

      this.prev = this.current;
      this.current = i;

      Morphing.clear(this.shape, this.models[this.prev]);

      let morphs = Morphing.generate(this.shape, this.models[i], { 
        start: Projects[this.current].letter.transition.origin, 
      });

      Morphing.run(this.timeline, this.shape, morphs, {
        duration: .7,
        step: .005
      });

      StageStore.cover = Projects[this.current].id;

      this.timeline.to(this.shape, .6, StageStore.getShadow(Projects[this.current].shadow), 0);

    };
    
    component.methods.previous = function () { 

      var i = this.current-1; 
      i = (i >= 0) ? i : Projects.length-1;

      this.go(i);

    };  
    
    component.methods.next = function () { 
      
      let i = (this.current+1)%Projects.length;

      this.go(i);

    };



    /* Export */

    export default component;
    

  </script>


  <template lang="jade">
    
    //- Root
    .home
      
      //- Titles
      titles(v-bind:current="current", v-bind:mouse="mouse")

      //- Message
      //- p.home-accessMessage
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
      opacity 0

      .titles
        position absolute
        z-index 800
        top calc(50% - 2.5em)
        left 50%
        width 50%
        height 50%

      .home-stage
        display block
        position absolute
        z-index 500
        top 0
        left 0
        width 100%
        height 100%
    
    .home-accessMessage
      display block
      position absolute
      z-index 800
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
  