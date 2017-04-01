


  <script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';
    import { TweenMax } from 'gsap';

    import Paper from 'paper';
    Paper.install(window);

    import S from '../../../shared/helpers/sizes.js';
    import Ticker from '../../../shared/helpers/ticker.js';

    import Mixins from './mixins.js';

    import Projects from '../projects.json';



    
    /* Component */

    var component = { name: 'tracker', methods: {} };


    // Mixins
    
    component.mixins = [ Mixins.Covers, Mixins.Distorsion ];


    // Properties
    
    component.props = {
      current: { type: Number, default: 0 },
      content: { type: Array, default: [] },
      mouse: { type: Object }
    };

    component.data = function () {
      return { 
        length: this.content.length,
      };
    };

    component.watch = {
      current: function (val) {
        this.go(val);
        this.prev = val;
      }
    }


    // Init
    
    component.created = function () {

      this.position = { 
        x: 0,
        y: 0
      };

    };

    component.mounted = function () {
      
      this.draw();
      this.launch(this.current);

      this.container.insertChild(0, this.shape);
      this.container.clipped = true;

      $(window).on('resize', () => { this.resize(); });

    };


    // Draw
    
    component.methods.draw = function () {

      this.shape = new Path.Circle({
        center: [tracker.s*.5, tracker.s*.5],
        radius: tracker.r
      });
      this.shape.flatten(8)
      this.shape.smooth();
      this.shape.fillColor = '#000';

    };
    
    component.methods.resize = function () {

      this.view.viewSize.width = tracker.s;
      this.view.viewSize.height = tracker.s;

      this.draw();
      this.container.children[0].replaceWith(this.shape);
      this.container.clipped = true;

    };



    // Launch
    
    component.methods.launch = function (i) {

      TweenMax.set(this.$el, {
        left: this.position.x,
        top: this.position.y
      });
      this.view.viewSize = new Paper.Size(tracker.s, tracker.s);

      this.covers[i].opacity = 1;

      new Ticker().tick('tracker.animation', this._animate);

    };


    // Transition
    
    component.methods.go = function (i) {

      this._coversTransition(i);      

    };


    // Animations
    
    component.methods._animate = function (f) {
  
      this.position.x += ((this.mouse.abs.x - tracker.s*.5) - this.position.x) * .1;
      this.position.y += ((this.mouse.abs.y - tracker.s*.5) - this.position.y) * .1;

      TweenMax.set(this.$el, { left: this.position.x, top: this.position.y });
      let offsetX = sw*.5 - tracker.s*.5 - this.position.x + this.view.viewSize.width*.5;
      let offsetY = sh*.5 - tracker.s*.5 - this.position.y + this.view.viewSize.height*.5;
      this.covers[this.current].position.x = offsetX;
      this.covers[this.current].position.y = offsetY;

      this._distord(f, tracker.distorsion);

      this.view.update();

    };


    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
  
      canvas.background-tracker(ref="canvas")

  </template>


  <style lang="stylus">

    .background-tracker
      position fixed
      /*background rgba(#00ff00, 0.05)*/
    
    /*canvas.background-trackerCanvas*/
      

  </style>
  