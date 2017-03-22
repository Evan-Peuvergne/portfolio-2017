


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

      this.pos = { x: sw/2 - this.size/2, y: sh/2 - this.size/2 };
      this.offset = { x: this.pos.x - this.size/2, y: this.pos.y - this.size/2 };

      this.stage = new Project(this.$el);
      this.stage.view.viewSize = new Size(this.size, this.size);
      TweenMax.set(this.stage.view.element, { x: this.pos.x, y: this.pos.y });

      this.shape = new Path.Circle({
        center: [this.size*.5, this.size*.5],
        radius: this.radius
      });
      this.shape.flatten(8)
      this.shape.smooth();
      this.shape.fillColor = '#000';

      this.container = new Group();
      this.container.addChild(this.shape);
      this.container.clipped = true;

      this.covers = [];
      _.each(this.content, (c, i) => {
        this.covers[i] = new Raster({
          source: c.cover.url, 
          position: new Point(this.size/2, this.size/2),
          opacity: 0
        });
        this.covers[i].onLoad = function () {
          this.ratio = Math.max(S.window.w/this.size.width, S.window.h/this.size.height);
          this.size = new Size(this.size.width*this.ratio, this.size.height*this.ratio);
        };
        this.container.addChild(this.covers[i]);
      });

      this.launch();

    };


    // Launch
    
    component.methods.launch = function () {

      this.prev = this.current;

      this.covers[this.current].opacity = 1;

      new Ticker().tick('home.background.tracker', (f) => { 
        this._calculatePosition();
        this._calculateOffset();
        this._animate(f);
      });

    };


    // Go
    
    component.methods.go = function (i) {

      TweenMax.to(this.covers[this.prev], .5, { opacity: 0, ease: Power2.easeOut });
      TweenMax.to(this.covers[i], .5, { opacity: 1, ease: Power2.easeOut });

    };


    // Positions
    
    component.methods._calculatePosition = function () {  

      this.pos.x += ((this.mouse.x - this.size*.5) - this.pos.x)*0.1;
      this.pos.y += ((this.mouse.y - this.size*.5) - this.pos.y)*0.1;

    };

    component.methods._calculateOffset = function () {
      
      this.offset.x += ((S.window.w*.5 - this.mouse.x + this.size/2) - this.offset.x)*0.1;
      this.offset.y += ((S.window.h*.5 - this.mouse.y + this.size/2) - this.offset.y)*0.1;

    };


    // Animations
    
    component.methods._animate = function (f) {

      _.each(this.shape.segments, (s, i) => {
        s.point.x += Math.cos(f.count*.3 + i*2) * .5;
        s.point.y += -Math.sin(f.count*.3 + i*i) * .5;
      });

      TweenMax.set(this.stage.view.element, { x: this.pos.x, y: this.pos.y });
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
  