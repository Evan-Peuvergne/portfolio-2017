


  <script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';

    import { TimelineMax } from 'gsap';

    import Paper from 'paper';

    import Ticker from '../../vendors/helpers/ticker.js';

    import Projects from '../../pages/home/projects.json';


    
    /* Component */

    var component = { 
      name: 'shade', 
      methods: {},
      mixins: []
    };


    // Properties
    
    component.props = {
      current: { type: Number, default: 0 },
      letter: { type: Object },
      tracker: { type: Object },
      models: { type: Array },
      mouse: { type: Object }
    };

    component.data = function () {
      return {};
    };

    component.watch = {
      current: function (val) {
        this.go(val);
        this.prev = val;
      }
    };


    component.components = {  };


    // Init
    
    component.created = function () {

      this.prev = this.current;
      this.parallax = { x: 0, y: 0 };

      this.shades = [];

      this.tl = new TimelineMax();

    };

    component.mounted = function () {

      this.stage = new Paper.Project(this.$el);
      this.view = this.stage.view;
      this.view.autoUpdate = true;

      this.shades = new Paper.Group();

      this.stage.activeLayer.addChildren([this.letter, this.tracker]);
      TweenMax.set(this.letter, this.getStyles(this.current));
      TweenMax.set(this.tracker, this.getStyles(this.current));

      this.models.forEach((m, i) => {

        let s = new Paper.PointText({
          point: [0, 0],
          content: Projects[i].glyph,
          fontFamily: 'Gotham Bold',
          fontSize: sh*.8,
          opacity: 0,
        });

        s.point.x = m.position.x - s.bounds.width * (Projects[i].shade.offset.x + .5);
        s.point.y = m.position.y + s.bounds.height * (Projects[i].shade.offset.y + .25);

        s.x = s.ox = s.point.x;
        s.y = s.oy = s.point.y;

        this.shades.addChild(s);

      });
      this.shades.children[0].opacity = 0.02;

      new Ticker().tick('shade.animation', this.animate);

    };


    // Draw
    
    component.methods.draw = function () {

      this.view.viewSize = new Paper.Size(sw, sh);

    };

    component.methods.resize = function () {

      

    }


    // Transition
    
    component.methods.go = function (i) {

      this.tl.clear();

      this.tl.to(this.letter, .6, this.getStyles(i), 0);
      this.tl.to(this.tracker, .6, this.getStyles(i), 0);

      let from = this.shades.children[this.prev];
      this.tl.fromTo(from, .5, 
        { y: from.oy, opacity: 0.02 }, 
        { y: from.oy - 300, opacity: 0, ease: ease.default, }, 0);

      let to = this.shades.children[i];
      this.tl.fromTo(to, .5, 
        { y: to.oy + 300, opacity: 0 }, 
        { y: to.oy, opacity: 0.02, ease: ease.default, }, 0);

    };


    // Animate
    
    component.methods.animate = function (f) {

      this.parallax.x += (this.mouse.orth.x*shade.p.x - this.parallax.x) * .1;
      this.parallax.y += (this.mouse.orth.y*shade.p.y - this.parallax.y) * .1;

      this.shades.children.forEach(s => {
        s.point.x = s.x + this.parallax.x;
        s.point.y = s.y + this.parallax.y;
      });

      this.view.update();

    };


    // Utils
    
    component.methods.getStyles = function (i) {

      var styles = {
        fillColor: Projects[i].shadow.color,
        shadowColor: Projects[i].shadow.color, 
        shadowBlur: 60,
        opacity: Projects[i].shadow.opacity,
        ease: ease.default
      };

      return styles;

    };


    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    canvas.shade

  </template>


  <style lang="stylus" scoped>

    .shade
      position absolute
      z-index 200
      top 0
      left 0
      width 100%
      height 100%

  </style>