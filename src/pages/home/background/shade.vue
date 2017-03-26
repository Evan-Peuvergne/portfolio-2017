


  <script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';
    import Paper from 'paper';

    import Ticker from '../../../shared/helpers/ticker.js';


    
    /* Component */

    var component = { 
      name: 'shade', 
      methods: {},
      mixins: []
    };


    // Properties
    
    component.props = {
      current: { type: Number, default: 0 },
      content: { type: Array, default: [] },
      mouse: { type: Object}
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
    };


    component.components = {  };


    // Init
    
    component.created = function () {

      this.parallax = { x: 0, y: 0 };

    };

    component.mounted = function () {

      this.stage = new Paper.Project(this.$el);
      this.view = this.stage.view;
      this.view.viewSize = new Paper.Size(sw, sh);
      // this.view.autoUpdate = false;

      this.shapes = [];
      _.each(this.content, (c, i) => {

        let model = new Paper.CompoundPath(c.letter.path);
        model.fitBounds(new Paper.Rectangle({
          point: [ 0, sh*(1-c.letter.size)/2 ], size: [ sw, sh*c.letter.size ] 
        }));

        let x = sw*.5 - model.bounds.width*(1-c.letter.offset.x) - 25;
        let y = sh*.5 - model.bounds.height*c.letter.offset.y;

        let shape = new Paper.PointText({
          point: [0, 0],
          content: c.glyph,
          fontFamily: 'Gotham Bold',
          fontSize: sh*.8,
          opacity: 0
        });
        shape.point.x = x - shape.bounds.width * (c.shade.offset.x + .5);
        shape.point.y = y + shape.bounds.height * (c.shade.offset.y + .25);
        shape.ox = shape.point.x;
        shape.oy = shape.point.y;

        this.shapes.push(shape);

      });

      this.launch();

    };


    // Launch
    
    component.methods.launch = function (i = 0) {

      this.prev = i;

      this.shapes[i].opacity = 0.02;
      this.view.update();

      new Ticker().tick('shade.animation', this._animate);

    };


    // Transition
    
    component.methods.go = function (i) {

      let tl = new TimelineMax();

      let from = this.shapes[this.prev];
      let to = this.shapes[this.current];

      tl.fromTo(from.point, .75, { y: from.oy }, { y: from.oy-200, ease: ease.elastic }, 0);
      tl.fromTo(from, .75, { opacity: 0.02 }, { opacity: 0, ease: ease.default }, 0);

      tl.fromTo(to.point, .75, { y: to.oy+200 }, { y: to.oy, ease: ease.elastic }, 0);
      tl.fromTo(to, .75, { opacity: 0 }, { opacity: 0.02, ease: ease.default }, 0);

    };


    // Animate
    
    component.methods._animate = function (f) {

      this.parallax.x += (this.mouse.orth.x*shade.p - this.parallax.x) * .1;
      this.parallax.y += (this.mouse.orth.y*shade.p - this.parallax.y) * .1;

      TweenMax.set(this.$el, _.clone(this.parallax));

    };


    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    canvas.background-shade

  </template>


  <style lang="stylus" scoped>



  </style>