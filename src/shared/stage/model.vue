


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
      name: 'model', 
      methods: {},
      mixins: []
    };


    // Properties
    
    component.props = {};

    component.data = function () {
      return {
        state: StageStore.is,
      };
    };

    component.components = {};


    // Hooks
    
    component.created = function () {

      this.shape = StageStore.model;

      this.parallax = { x: 0, y: 0 };

    };

    component.mounted = function () {

      this.svg = SVG.adopt(this.$el);

      new Ticker().tick('model.animation', this.animate);

    };


    // Animation
    
    component.methods.animate = function (f) {

      if(!StageStore.is.active){ return; }

      if(StageStore.is.parallaxing){
        this.parallax.x += (StageStore.mouse.orth.x*tracker.p - this.parallax.x) * .1;
        this.parallax.y += (StageStore.mouse.orth.y*tracker.p - this.parallax.y) * .1;
      }

      this.shape.children.forEach(c => {
        c.segments.forEach((s, i) => {

          if(StageStore.is.sourcing) {   
            [s.point, s.handleIn, s.handleOut].forEach(p => {
              p.x = p.ox; p.y = p.oy;
            });   
          }

          if(StageStore.is.parallaxing){
            s.point.x += this.parallax.x;
            s.point.y += this.parallax.y;
          }

          if(StageStore.is.distording){
            s.point.x += Math.cos(f.time*StageStore.distorsion.frequency + i) * StageStore.distorsion.amplitude;
            s.point.y += Math.cos(f.time*StageStore.distorsion.frequency + 2*i) * StageStore.distorsion.amplitude;
          }

        });
      });

      StageStore.view.update();
      this.svg.attr('d', this.shape.pathData);

    };

    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    //- Root
    path.model(ref="path")

  </template>


  <style lang="stylus" scoped>

    .model
      fill #ffffff

  </style>
  