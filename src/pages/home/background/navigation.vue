


  <script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';
    import Paper from 'paper';
    
    import Mixins from './mixins';

    import Ticker from '../../../shared/helpers/ticker.js';


    
    /* Component */

    var component = { 
      name: 'navigation', 
      methods: {},
      mixins: [ Mixins.Covers, ]
    };


    // Properties
    
    component.props = {
      direction: { type: String },
      mouse: { type: Object }
    };

    component.data = function () {
      return { 
        size: nav.r*2.5,
        radius: nav.r,
      };
    };

    component.watch = {
      current: function (val) {
        this.go(val);
        this.prev = val;
      }
    };


    component.components = {};


    // Init
    
    component.created = function () {



    };

    component.mounted = function () {

      this.view.viewSize = new Size(this.radius, this.radius*2);

      this.shape = new Paper.Shape.Circle({
        center: [
          (this.direction == 'previous') ? '0' : nav.r, 
          nav.r],
        radius: this.radius,
      });
      this.shape.fillColor = '#000';

      this.shade = this.shape.clone();
      this.shade.fillColor = '#000';
      this.shade.opacity = 0.02;

      this.container.insertChild(0, this.shape);
      this.container.clipped = true;

      this.view.update();

    };


    // Draw
    
    component.methods.draw = function () {

      

    };
    
    component.methods.resize = function () {

      

    };


    // Animate
    
    component.methods._animate = function (f) {

      this.parallax.x += (this.mouse.orth.x*tracker.p - this.parallax.x) * .1;
      this.parallax.y += (this.mouse.orth.y*tracker.p - this.parallax.y) * .1;

      let distorsion = this.content[this.current].letter.distorsion;

      _.each(this.shape.children, (c) => {
        _.each(c.segments, (s, i) => {
          s.point.x = s.point.ox - this.bounds.x + this.parallax.x + Math.cos(f.count*distorsion.frequency + i) * distorsion.amplitude;
          s.point.y = s.point.oy - this.bounds.y + this.parallax.y - Math.sin(f.count*distorsion.frequency + i) * distorsion.amplitude;
          s.handleIn.x = s.handleIn.ox;
          s.handleIn.y = s.handleIn.oy;
          s.handleOut.x = s.handleOut.ox;
          s.handleOut.y = s.handleOut.oy;
        });
      });

      this._transfer();

    };


    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    .home-backgroundNavigation(v-bind:class="[direction]", v-bind:style="{width: size*.75 + 'px', height: (size*1.5) + 'px'}")
      canvas(ref="canvas")


  </template>


  <style lang="stylus" scoped>

    .home-backgroundNavigation
      display block
      position absolute
      z-index 800
      top 50%
      transform translate3d(0, -50%, 0)
      /*background rgba(#00ff00, 0.1)*/

      canvas
        position absolute
        top 50%
        transform translate3d(0, -50%, 0)
        /*background rgba(#ff0000, 0.1)*/

      &.previous
        left 0

      &.next
        right 0

        canvas
          right 0

  </style>
  