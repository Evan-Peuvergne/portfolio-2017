


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

      // Add letter shape definition here

      this.tracker = new Paper.Path.Circle({
        center: [tracker.s*.5, tracker.s*.5],
        radius: tracker.r
      });
      this.$refs.tracker.define(this.tracker);
      // console.log(this.$refs.tracker);

      this.draw();
      this.$refs.letter.define(this.shapes[this.current]);
      this.$refs.letter.shape.fillColor = '#ff7731';
      this.$refs.letter.shape.opacity = 0.5;
      this.$refs.letter.shape.shadowColor = '#ff7731';
      this.$refs.letter.shape.shadowBlur = 20;
      this.$refs.letter.shape.shadowOffset = 0;

      $(this.$refs.images[0]).attr('opacity', 1);

    };


    // Draw
    
    component.methods.draw = function () {

      this.canvas.view.viewSize = new Paper.Size(sw, sh);

      this.shapes = [];
      this.content.forEach((c, i) => {

        let s = new Paper.CompoundPath(c.letter.path);
        let fitter = new Paper.Rectangle({
          point: [0, sh*(1-c.letter.size)/2],
          size: [sw, sh*c.letter.size]
        });
        s.fitBounds(fitter);

        s.position.x = sw*.5 - s.bounds.width*(1-c.letter.offset.x) - 25;
        s.position.y = sh*.5 - s.bounds.height*c.letter.offset.y;

        this.shapes.push(s);

      });

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
            feGaussianBlur(in="SourceGraphic" v-bind:stdDeviation="8" result="blur")
            feColorMatrix(in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo")
            feComposite(in="SourceGraphic" in2="goo" operator="atop")

        //- Background
        g.home-stageBackground(clip-path="url(#mask)", filter="url(#organic)")
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

  </style>
  