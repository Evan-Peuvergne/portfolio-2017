


  <script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';

    import SVG from 'svg.js';
    import Paper from 'paper';

    import Letter from './letter.vue';
    import Tracker from './tracker.vue';
    import Background from './background.vue';

    import Ticker from '../../../shared/helpers/ticker.js';

    import Projects from '../projects.json';


    
    /* Component */

    var component = { 
      name: 'stage', 
      methods: {},
      mixins: []
    };


    // Properties
    
    component.props = {
      current: { type: Number, default: 0 },
      content: { type: Array, default: [] },
      mouse: { type: Object },
    };

    component.data = function () {
      return {
        region: { x: 0, y: 0, width: 100, height: 100 }
      };
    };

    component.watch = {
      current: function (val) {
        this.go(val);
        this.prev = val;
      }
    };


    component.components = { Letter, Tracker, Background };


    // Hooks
    
    component.created = function () {

      this.covers = [];
      this.prev = this.current;

      this.tl = new TimelineMax();

    };

    component.mounted = function () {

      this.svg = new SVG(this.$refs.svg);
      this.canvas = new Paper.Project(this.$refs.canvas);
      this.canvas.view.autoUpdate = false;

      this.draw();

      this.letter = new Paper.CompoundPath();
      this.letter.strokeWidth = 0;
      this.$refs.letter.shape = this.letter;
      this.$refs.letter.draw();
      this.setRegion(this.$refs.letter.shapes[this.current].bounds);

      this.tracker = new Paper.Path.Circle({
        center: [tracker.s*.5, tracker.s*.5],
        radius: tracker.r
      });
      this.$refs.tracker.shape = this.tracker;
      this.$refs.tracker.draw();

      this.letter.fillColor = this.letter.shadowColor = this.tracker.fillColor = this.tracker.shadowColor = Projects[this.current].shadow.color;
      this.letter.shadowBlur = this.tracker.shadowBlur = 75;
      this.letter.opacity = this.tracker.opacity = Projects[this.current].shadow.opacity;
      
      this.container = SVG.adopt(this.$refs.container);

    };


    // Draw
    
    component.methods.draw = function () {

      this.canvas.view.viewSize = new Paper.Size(sw, sh);

    };

    component.methods.resize = function () {

      this.tl.clear();

    };


    // Transition
    
    component.methods.go = function (index) {

      let anims = {
        fillColor: Projects[index].shadow.color,
        shadowColor: Projects[index].shadow.color,
        opacity: Projects[index].shadow.opacity,
        ease: ease.default
      };

      this.tl.clear();
      this.tl.to(this.letter, .6, _.clone(anims), 0);
      this.tl.to(this.tracker, .6, _.clone(anims), 0);

      this.setRegion(this.$refs.letter.shapes[index].bounds);

    };


    // Utils
    
    component.methods.setRegion = function (bounds) {

      bounds = bounds.expand(tracker.p + 10);

      this.region = { 
        x: (bounds.x/sw*100) + '%', 
        y: (bounds.y/sh*100) + '%', 
        width: (bounds.width/sw*100) + '%', 
        height: (bounds.height/sh*100) + '%' 
      };

    };

    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    //- Root
    .home-stage
      
      //- SVG
      svg.home-stageSVG(width="100%", height="100%", shape-rendering="optimizeSpeed", ref="svg")

        //- Defs
        defs

          tracker(v-bind:current="current", v-bind:mouse="mouse", ref="tracker")

          clipPath#mask
            use(xlink:href="#maskTracker")
            letter(v-bind:current="current", v-bind:mouse="mouse", v-bind:content="content" ref="letter")

          clipPath#maskFallback
            use(xlink:href="#maskTracker")

          filter(id="organic", v-bind:x="region.x", v-bind:y="region.y", v-bind:width="region.width", v-bind:height="region.height")
            feGaussianBlur(in="SourceGraphic" v-bind:stdDeviation="6" result="blur")
            feColorMatrix(in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo")
            feComposite(in="SourceGraphic" in2="goo" operator="over")


      //- Fallback
      .home-stageFallback
        background(v-bind:current="current")

      
      //- Background
      .home-stageBackground
        div.home-stageOrganic
          div.home-stageMask
            background(v-bind:current="current")
  
      //- Canvas
      canvas.home-stageCanvas(ref="canvas")

  </template>


  <style lang="stylus" scoped>
    
    .home-stage
    .home-stageSVG
    .home-stageCanvas
    .home-stageBackground
    .home-stageFallback
      display block
      position absolute
      top 0
      left 0
      width 100%
      height 100%

    .home-stageBackground
      z-index 600

    .home-stageFallback
      z-index 590
      clip-path url(#maskFallback)
    
    .home-stageMask
      width 100%
      height 100%
      clip-path url(#mask)

    .home-stageOrganic
      width 100%
      height 100%
      filter url(#organic)

    .home-stageSVG
      z-index 500

    .home-stageCanvas
      z-index 300

  </style>
  