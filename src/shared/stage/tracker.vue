


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

      this.tracker.children[0] = new Paper.Path.Circle({
        center: [sw/2 - tracker.r, -tracker.r],
        radius: tracker.r,
        fillColor: '#000',
      });

      new Ticker().tick('tracker.animation', this.animate);

    };


    // Animation
    
    component.methods.animate = function (f) {

      // this.parallax.x += ()

    };

    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    //- Root
    path.tracker(ref="path")

  </template>


  <style lang="stylus" scoped>

    

  </style>
  