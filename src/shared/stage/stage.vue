<script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';

    import { TweenMax } from 'gsap';
    import Paper from 'paper';

    import Model from './model.vue';
    import Covers from './covers.vue';

    import Projects from '../projects.json';

    import StageStore from './store.js';


    
    /* Component */

    var component = { 
      name: 'stage', 
      methods: {},
      mixins: []
    };


    // Properties
    
    component.props = {
      // shape: { type: Object },
    };

    component.data = function () {

      return {
        canvas: StageStore.canvas,
        shape: StageStore.shape,
      };

    };


    component.components = { Model, Covers };


    // Hooks
    
    component.created = function () {

      this.view = StageStore.view;

    };

    component.mounted = function () {

      this.view.element.className = 'stage-canvas';
      this.$el.appendChild(this.view.element);

      this.view.autoUpdate = false;

      TweenMax.set(this.shape, this.getStyles(Projects[0].shadow));

      this.draw();

    };


    // Draw
    
    component.methods.draw = function () {

      this.view.viewSize = new Paper.Size(sw, sh);

    };

    component.methods.resize = function () {

      

    };


    // Transition
    
    component.methods.go = function (i) {

      

    };


    // Utils
    
    component.methods.setRegion = function (bounds) {

      

    };

    component.methods.getStyles = function (config) {

      var styles = {
        fillColor: config.color,
        shadowColor: config.color, 
        shadowBlur: 60,
        opacity: config.opacity,
        ease: ease.default
      };

      return styles;

    };

    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    //- Root
    .stage

      //- SVG
      svg.stage-svg(width="100%" height="100%" shape-rendering="optimizeSpped" ref="svg")

        defs

          mask.stage-mask#mask
            g(filter="url(#organic)")
              model(v-bind:shape="shape")

          filter.stage-filter#organic
            feGaussianBlur(in="SourceGraphic" stdDeviation="6" result="blur")
            feColorMatrix(in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo")
            feComposite(in="SourceGraphic" in2="goo" operator="over")

        g.stage-covers(mask="url(#mask)")
          covers

  </template>


  <style lang="stylus">
    
    .stage-svg
    .stage-canvas
      display block
      position absolute
      top 0
      left 0
      width 100%
      height 100%

    .stage-svg
      z-index 1120

    .stage-canvas
      z-index 1110

  </style>
  