


  <script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';

    import SVG from 'svg.js';
    import Paper from 'paper';

    import Letter from './letter.vue';

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


    component.components = { Letter, };


    // Hooks

    component.mounted = function () {

      this.svg = new SVG(this.$refs.container);
      this.paper = new Paper.Project();
      this.paper.view.autoUpdate = false;
      this.$parent.$el.appendChild(this.paper.view.element);

      this.draw();
      this.$refs.letter.define(this.shapes[this.current]);
      // this.$refs.letter.shape.fillColor = '#000';

    };


    // Draw
    
    component.methods.draw = function () {

      this.paper.view.viewSize = new Paper.Size(sw, sh);

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
    svg.home-stage(width="100%", height="100%", ref="container")

      //- Defs
      defs

        clipPath.home-stageMask#mask
          letter(v-bind:current="current", v-bind:mouse="mouse", v-bind:shapes="shapes", v-bind:content="content" ref="letter")
          path.home-stageTracker

        filter(id="shadow")
          feOffset(dx="0", dy="0", result="offset", in="SourceGraphic")
          feGaussianBlur(stdDeviation="20", result="blur", in="offset")
          feComponentTransfer
            feFuncA(type="linear", slope="0.6")
          feMerge
            feMergeNode
            feMergeNode(in="SourceGraphic")

      //- Background
      g.home-stageBackground(clip-path="url(#mask)")
        template(v-for="c in content")
          image(v-bind:href="c.cover.url", preserveAspectRatio="xMidYMid slice", width="100%", height="100%")

  </template>


  <style lang="stylus">
    
    canvas
      position absolute
      z-index -1
      top 0
      left 0
      width 100%
      height 100%

  </style>
  