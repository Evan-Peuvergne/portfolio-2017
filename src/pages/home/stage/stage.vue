


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
      new Paper.Project();
      return {
        letter: new Paper.CompoundPath(),
        models: _.map(Projects, (p) => { return new Paper.CompoundPath(p.letter.path); }),
        region: { x: 0, y: 0, width: 100, height: 100 }
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

      this.tl = new TimelineMax();

    };

    component.mounted = function () {

      this.draw();
      this.letter.children = _.cloneDeep(this.models[this.current].children);
      this.setRegion(this.models[this.current].bounds);

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
    
    component.methods.go = function (index) {

      let anims = {
        fillColor: Projects[index].shadow.color,
        shadowColor: Projects[index].shadow.color,
        opacity: Projects[index].shadow.opacity,
        ease: ease.default
      };

      this.tl.clear();
      this.tl.to(this.letter, .6, _.clone(anims), 0);
      // this.tl.to(this.tracker, .6, _.clone(anims), 0);

      this.setRegion(this.models[index].bounds);

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

          //- tracker(v-bind:current="current", v-bind:mouse="mouse", ref="tracker")

          clipPath#mask
            //- use(xlink:href="#maskTracker")
            letter(v-bind:current="current", v-bind:mouse="mouse", v-bind:shape="letter", v-bind:models="models", ref="letter")

          clipPath#maskFallback
            //- use(xlink:href="#maskTracker")

          filter(id="organic", v-bind:x="region.x", v-bind:y="region.y", v-bind:width="region.width", v-bind:height="region.height")
            feGaussianBlur(in="SourceGraphic" v-bind:stdDeviation="5" result="blur")
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

      //- Shade
      shade(v-bind:current="current", v-bind:letter="letter")

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
      /*background red*/

  </style>
  