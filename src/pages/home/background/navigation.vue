


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
      mixins: [ Mixins.Mask, ]
    };


    // Properties
    
    component.props = {
      direction: { type: String },
      mouse: { type: Object },
      content: { type: Array, default: [] }
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

      this.stage = new Paper.Project(this.$refs.canvas);
      this.view = this.stage.view;
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

      this.container = new Paper.Group();
      this.covers = this.drawCovers(this.container);
      this.container.insertChild(0, this.shape);
      this.container.clipped = true;

      $(this.$el).on('click', (e) => { 
        e.preventDefault(); 
        this.$events.emit('home.navigation', { direction: this.direction });
      });

      this.draw();

    };


    // Draw
    
    component.methods.draw = function () {

      let fRect = this.$refs.container.getBoundingClientRect();
      this.bounds = new Paper.Rectangle({
        point: [fRect.left, fRect.top], size: [fRect.width, fRect.height] });

      let cRect = this.$refs.canvas.getBoundingClientRect();
      let bounds = new Paper.Rectangle({ 
        point: [cRect.left, cRect.top], size: [cRect.width, cRect.height] }); 
      _.each(this.covers, (c, i) => { this.offsetCover(i, bounds); });


    };
    
    component.methods.resize = function () {

      

    };


    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    .home-navigation(v-bind:class="[direction]", v-bind:style="{width: size + 'px', height: (size*2.5) + 'px'}")
      .home-navigationContainer(v-bind:style="{width: size*0.75 + 'px', height: size*1.5 + 'px'}", ref="container")
        canvas(ref="canvas")


  </template>


  <style lang="stylus" scoped>

    .home-navigation
      display block
      position absolute
      z-index 800
      top 50%
      transform translate3d(0, -50%, 0)
      cursor pointer

      .home-navigationContainer
        position absolute
        top 50%
        filter url(#organic)
        transform translate3d(0, -50%, 0)

      canvas
        position absolute
        top 50%
        transform translate3d(0, -50%, 0)

      &.previous
        left 0

      &.next
        right 0

        .home-navigationContainer
        canvas
          right 0

  </style>
  