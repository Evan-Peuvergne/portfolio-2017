


  <script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';

    import SVG from 'svg.js';
    import Paper from 'paper';

    import Letter from './letter.vue';
    import Tracker from './tracker.vue';
    import Background from './background.vue';
    import Shade from './shade.vue';

    import Ticker from '../../vendors/helpers/ticker.js';

    import Projects from '../../pages/home/projects.json';


    
    /* Component */

    var component = { 
      name: 'stage', 
      methods: {},
      mixins: []
    };


    // Properties
    
    component.props = {
      current: { type: Number, default: 0 },
      // content: { type: Array, default: [] },
      mouse: { type: Object },
    };

    component.data = function () {
      new Paper.Project();
      return {
        shape: new Paper.CompoundPath(),
        tracker: new Paper.Path.Circle({ center: [0, 0], radius: tracker.r }),
        region: { x: 0, y: 0, width: 100, height: 100 },
        content: Projects,
      };
      Paper.project.remove();
    };

    component.watch = {
      current: function (val) {
        this.go(val);
        this.prev = val;
      }
    };


    component.components = { Letter, Tracker, Background, Shade };


    // Hooks
    
    component.created = function () {

      this.prev = this.current;

      this.draw();

    };

    component.mounted = function () {

      // this.letter.children = _.cloneDeep(this.models[this.current].children);
      // this.setRegion(this.models[this.current].bounds);

      $(window).on('resize', this.resize);

    };


    // Draw
    
    component.methods.draw = function () {

      this.models.forEach((m, i) => {

        let settings = Projects[i].letter
        let fitter = new Paper.Rectangle({
          point: [0, sh*(1-settings.size)/2],
          size: [sw, sh*settings.size]
        });
        m.fitBounds(fitter);

        m.position.x = sw*.5 - m.bounds.width*(1-settings.offset.x) - 25;
        m.position.y = sh*.5 - m.bounds.height*settings.offset.y;
        
        m.children.forEach(c => { c.segments.forEach(s => {
          [s.point, s.handleIn, s.handleOut].forEach(p => { p.ox = p.x; p.oy = p.y; });
        }); });

      });     

    };

    component.methods.resize = function () {

      this.draw();

    };


    // Transition
    
    component.methods.go = function (i) {

      this.setRegion(this.models[i].bounds);

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
          
          mask#mask
            g(filter="url(#organic)" style="background: red;")
              tracker(v-bind:shape="tracker", v-bind:current="current", v-bind:mouse="mouse", ref="tracker")
              letter(v-bind:current="current", v-bind:mouse="mouse", v-bind:shape="letter", v-bind:models="models", ref="letter")

          filter(id="organic")
            feGaussianBlur(in="SourceGraphic" v-bind:stdDeviation="7" result="blur")
            feColorMatrix(in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo")
            feComposite(in="SourceGraphic" in2="goo" operator="over")

        //- Covers 
        g(mask="url(#mask)")
          background(v-bind:current="current")


      //- Shade
      shade(v-bind:current="current", v-bind:letter="letter", v-bind:tracker="tracker", v-bind:models="models", v-bind:mouse="mouse")

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
      /*mask url(#maskFallback)*/
    
    .home-stageMask
      width 100%
      height 100%
      mask url(#mask)

    .home-stageOrganic
      width 100%
      height 100%
      filter url(#organic)

    .home-stageSVG
      z-index 500

    .home-stageCanvas
      z-index 300
      /*background red*/

  </style>
  