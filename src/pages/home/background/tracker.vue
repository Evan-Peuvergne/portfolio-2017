


  <script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';
    import { TweenMax } from 'gsap';

    import Paper from 'paper';
    Paper.install(window);

    import S from '../../../shared/helpers/sizes.js';
    import Ticker from '../../../shared/helpers/ticker.js';

    import Projects from '../projects.json';



    
    /* Component */

    var component = { name: 'tracker', methods: {} };


    // Properties
    
    component.props = {
      current: { type: Number, default: 0 },
      projects: { type: Array, default: function () { return []; } }
    };

    component.data = function () {
      return { 
        length: this.projects.length,
      };
    };

    component.watch = {
      current: function (val) {
        this.stage.go(val);
      }
    }


    // Init

    component.mounted = function () {

      this.radius = S.window.h*0.07;
      this.size = this.radius*2*1.3;

      this.mouse = { x: S.window.w/2, y: S.window.h/2 };
      this.position = { x: S.window.w/2 - this.size/2, y: S.window.h/2 - this.size/2 };
      this.offset = { x: this.position.x - this.size/2, y: this.position.y - this.size/2 };

      this.stage = new Project(this.$el);
      this.stage.view.viewSize = new Size(this.size, this.size);
      TweenMax.set(this.stage.view.element, { x: this.position.x, y: this.position.y });

      this.container = new Group();
      this.shape = new Path.Circle({
        center: [this.size*.5, this.size*.5],
        radius: this.radius
      });
      this.shape.fillColor = '#000';
      this.container.addChild(this.shape);
      this.container.clipped = true;

      this.covers = [];
      this.covers[0] = new Raster({
        source: Projects[0].cover.url,
        position: new Point(this.size/2, this.size/2)
      });
      this.covers[0].onLoad = function () {
        this.ratio = Math.max(S.window.w/this.size.width, S.window.h/this.size.height);
        this.size = new Size(this.size.width*this.ratio, this.size.height*this.ratio);
      };
      this.container.addChild(this.covers[0]);
      
      $(window).on('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });

      new Ticker().tick('home.background.tracker', (f) => { 
        this._calculatePosition();
        this._calculateOffset();
        this._animate();
      });

    };


    // Positions
    
    component.methods._calculatePosition = function () {  

      this.position.x += ((this.mouse.x - this.size*.5) - this.position.x)*0.1;
      this.position.y += ((this.mouse.y - this.size*.5) - this.position.y)*0.1;

    };

    component.methods._calculateOffset = function () {
      
      this.offset.x += ((S.window.w*.5 - this.mouse.x + this.size/2) - this.offset.x)*0.1;
      this.offset.y += ((S.window.h*.5 - this.mouse.y + this.size/2) - this.offset.y)*0.1;

    };


    // Animations
    
    component.methods._animate = function (f) {

      TweenMax.set(this.stage.view.element, { x: this.position.x, y: this.position.y });
      this.covers[0].position.x = this.offset.x;
      this.covers[0].position.y = this.offset.y;

    };


    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    canvas.background-tracker

  </template>


  <style lang="stylus">

    canvas.background-tracker
      /*background rgba(#000, 0.2)*/

  </style>
  