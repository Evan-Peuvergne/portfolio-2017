


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

    component.mounted = function () {

      this.radius = sh*0.07;
      this.size = this.radius*2*1.3;

      this.position = { x: sw*.5, y: sh*.5 };
      this.stage.view.viewSize = new Size(this.size, this.size);

      this.shape = new Path.Circle({
        center: [this.size*.5, this.size*.5],
        radius: this.radius
      });
      this.shape.flatten(8)
      this.shape.smooth();
      this.shape.fillColor = '#000';

      this.container.insertChild(0, this.shape);
      this.container.clipped = true;

      this.launch();

    };


    // Launch
    
    component.methods.launch = function () {

      this.prev = this.current;

      this.covers[this.current].opacity = 1;

      new Ticker().tick('home.background.tracker', (f) => { 
        // this._calculatePosition();
        // this._calculateOffset();
        this._animate(f);
      });

    };


    // Animations
    
    component.methods._animate = function (f) {
      
      this.position.x += (this.mouse.x - this.position.x) * .1;
      this.position.y += (this.mouse.y - this.position.y) * .1;

      this._displacement(this.position);
      this._distord(f);

    };


    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    canvas.background-tracker(ref="canvas2")

  </template>


  <style lang="stylus">

    canvas.background-tracker
      /*background rgba(#000, 0.1)*/

  </style>
  