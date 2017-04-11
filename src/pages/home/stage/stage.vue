


  <script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';

    import SVG from 'svg.js';
    import Paper from 'paper';

    import Letter from './letter.vue';
    import Tracker from './tracker.vue';

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
        shapes: [],
      };
    };

    component.watch = {
      current: function (val) {
        this.prev = val;
      }
    };


    component.components = { Letter, Tracker };


    // Hooks

    component.mounted = function () {

      this.svg = new SVG(this.$refs.svg);
      this.canvas = new Paper.Project(this.$refs.canvas);
      this.canvas.view.autoUpdate = false;

      this.draw();

      this.letter = new Paper.CompoundPath();
      this.$refs.letter.shape = this.letter;
      this.$refs.letter.draw();

      this.tracker = new Paper.Path.Circle({
        center: [tracker.s*.5, tracker.s*.5],
        radius: tracker.r
      });
      this.$refs.tracker.shape = this.tracker;
      this.$refs.tracker.draw();

      this.letter.fillColor = this.letter.shadowColor = this.tracker.fillColor = this.tracker.shadowColor = Projects[this.current].shadow.color;
      this.letter.shadowBlur = this.tracker.shadowBlur = 40;
      this.letter.opacity = this.tracker.opacity = Projects[this.current].shadow.opacity;
      
      this.container = SVG.adopt(this.$refs.container);

      $(this.$refs.images[0]).attr('opacity', 1);

    };


    // Draw
    
    component.methods.draw = function () {

      this.canvas.view.viewSize = new Paper.Size(sw, sh);

    };

    component.methods.resize = function () {



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

          clipPath.home-stageMask#mask
            tracker(v-bind:current="current", v-bind:mouse="mouse", ref="tracker")
            letter(v-bind:current="current", v-bind:mouse="mouse", v-bind:shapes="shapes", v-bind:content="content" ref="letter")

          filter(id="organic")
            feGaussianBlur(in="SourceGraphic" v-bind:stdDeviation="5" result="blur")
            feColorMatrix(in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo")
            feComposite(in="SourceGraphic" in2="goo" operator="over")

        //- Background
        g.home-stageBackground
          g(clip-path="url(#mask)")
            template(v-for="c in content")
              image(v-bind:href="c.cover.url", preserveAspectRatio="xMidYMid slice", width="100%", height="100%", opacity="0", ref="images")

      //- Canvas
      canvas.home-stageCanvas(ref="canvas")

  </template>


  <style lang="stylus" scoped>
    
    .home-stage
    .home-stageSVG
    .home-stageCanvas
      display block
      position absolute
      top 0
      left 0
      width 100%
      height 100%

    .home-stageSVG
      z-index 500

    .home-stageCanvas
      z-index 300

    .home-stageBackground
      filter: url(#organic)

  </style>
  