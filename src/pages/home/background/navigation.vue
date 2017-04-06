


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
      current: { type: Number },
      content: { type: Array, default: [] }
    };

    component.data = function () {
      return {
        selected: false,
        size: nav.r*2.5,
        radius: nav.r,
      };
    };

    component.computed = {
      index: function () {
        let inc = (this.direction == 'previous') ? -1 : 1;
        let index = this.current + inc;
        return (index > 0) ? (index%3) : this.content.length-1;
      },
      icon: function () {
        return './assets/icons/' + this.direction + '.svg';
      }
    };


    component.components = {};


    // Init

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

      this.shade = this.shape.clone();
      this.shade.fillColor = '#000';
      this.shade.opacity = 0.02;

      this.area = this.shape.clone();
      let scale = (this.radius + tracker.r)/this.radius + .01;
      this.area.scale(scale);

      this.container = new Paper.Group();
      this.shape.fillColor = '#000';
      this.covers = this.drawCovers(this.container);
      this.container.insertChild(0, this.shape);
      this.container.clipped = true;

      $(this.$el).on('click', (e) => { 
        e.preventDefault();
        if(!this.selected){ return false; }
        this.$events.emit('home.navigation', { direction: this.direction });
      });

      new Ticker().tick('navigation.' + this.direction, this.monitor);

      this.draw();

    };


    // Draw
    
    component.methods.draw = function () {

      let fRect = this.$refs.container.getBoundingClientRect();
      this.bounds = new Paper.Rectangle({
        point: [fRect.left, fRect.top], size: [fRect.width, fRect.height] });

      let cRect = this.$refs.canvas.getBoundingClientRect();
      this.canvasBounds = new Paper.Rectangle({ 
        point: [cRect.left, cRect.top], size: [cRect.width, cRect.height] }); 
      _.each(this.covers, (c, i) => { this.offsetCover(i, this.canvasBounds); });

    };
    
    component.methods.resize = function () {

      

    };


    // Monitor

    component.methods.monitor = function () {

      let t = new Paper.Point([
        this.mouse.abs.x - this.canvasBounds.x,
        this.mouse.abs.y - this.canvasBounds.y,
      ]);

      if(this.area.contains(t)){ 
        if(!this.selected){
          this.activate();
          this.selected = true;
        }
        return;
      }
      
      if(this.selected){
        this.deactivate();
        this.selected = false;
      }

      return;

    };


    // Activation
    
    component.methods.activate = function () {

      TweenMax.to(this.covers[this.index], 0.35, { opacity: 1, ease: ease.default });
      
      $(this.$refs.icon.contentDocument).find('#icon').css('stroke', '#fefefe');

      this.$events.emit('home.navigation.hovering', { 
        direction: this.direction,
        target: this.index, 
      });

    };

    component.methods.deactivate = function () {

      TweenMax.to(this.covers[this.index], 0.35, { opacity: 0, ease: ease.default });

      $(this.$refs.icon.contentDocument).find('#icon').css('stroke', '#323232');

      this.$events.emit('home.navigation.leaving', {
        direction: this.direction,
        target: this.index,
      });

    };


    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    .home-navigation(v-bind:class="[direction]", v-bind:style="{width: size + 'px', height: (size*2.5) + 'px'}")
      object.home-navigationIcon(type="image/svg+xml", v-bind:data="icon", ref="icon")
      .home-navigationContainer(v-bind:style="{width: size*0.75 + 'px', height: size*1.5 + 'px', filter: (selected) ? 'url(#organic)' : 'none'}", ref="container")
        canvas.home-navigationCanvas(ref="canvas")


  </template>


  <style lang="stylus" scoped>

    .home-navigation
      display block
      position absolute
      z-index 800
      top 50%
      transform translate3d(0, -50%, 0)
      cursor pointer

      .home-navigationIcon
        display block
        position absolute
        z-index 550
        top 50%
        width 1.1em
        transform translate3d(0, -50%, 0)

      .home-navigationContainer
        position absolute
        z-index 520
        top 50%
        transform translate3d(0, -50%, 0)
        /*background rgba(#00ff00, 0.1)*/

      .home-navigationCanvas
        position absolute
        top 50%
        transform translate3d(0, -50%, 0)


      &.previous
        left 0

        .home-navigationIcon
          left 1em

      &.next
        right 0

        .home-navigationIcon
          right 1em

        .home-navigationContainer
        canvas
          right 0

  </style>
  