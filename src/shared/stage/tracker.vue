


  <script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';

    import Paper from 'paper';
    import SVG from 'svg.js';

    import Ticker from '../../vendors/helpers/ticker.js';

    import StageStore from './store.js';


    
    /* Component */

    var component = { 
      name: 'tracker', 
      methods: {},
      mixins: []
    };


    // Properties
    
    component.props = {};

    component.data = function () {
      return {};
    };

    component.components = {};


    // Hooks
    
    component.created = function () {

      this.canvas = StageStore.canvas;
      this.view = StageStore.view;
      this.tracker = StageStore.tracker;

      this.parallax = { x: sw/2 - tracker.r, y: -tracker.r };

    };

    component.mounted = function () {

      this.svg = SVG.adopt(this.$el);

      this.$events.on('loaded', this.enter);

    };


    // Transitions
    
    component.methods.enter = function () {

      let shape = new Paper.Path.Circle({
        center: [0, 0],
        radius: tracker.r,
      });
      
      shape.flatten(8);
      shape.smooth();

      shape.segments.forEach(s => {
        [s.point, s.handleIn, s.handleOut].forEach(p => {
          p.ox = p.x; p.oy = p.y;
        });
      });

      this.tracker.children[0] = shape;

      new Ticker().tick('tracker.animation', this.animate);

    };


    // Animation
    
    component.methods.animate = function (f) {

      this.parallax.x += (StageStore.mouse.abs.x - this.parallax.x) * .2;
      this.parallax.y += (StageStore.mouse.abs.y - this.parallax.y) * .2;
      
      this.tracker.children[0].segments.forEach((s, i) => {
        s.point.x = s.point.ox + this.parallax.x + Math.cos(f.time*tracker.distorsion.f + i) * tracker.distorsion.a;
        s.point.y = s.point.oy + this.parallax.y - Math.sin(f.time*tracker.distorsion.f - i) * tracker.distorsion.a;
      });

      StageStore.view.update();
      this.svg.attr('d', this.tracker.pathData);

    };

    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    //- Root
    path.tracker(ref="path")

  </template>


  <style lang="stylus" scoped>

    .tracker
      fill #ffffff

  </style>
  