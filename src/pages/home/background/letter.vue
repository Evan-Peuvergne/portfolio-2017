


  <script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';
    import Paper from 'paper';
  
    import Mixins from './mixins';

    import Ticker from '../../../shared/helpers/ticker.js';


    
    /* Component */

    var component = { 
      name: 'letter', 
      methods: {},
      mixins: [ Mixins.Mask, Mixins.Morphs ]
    };


    // Properties
    
    component.props = {
      current: { type: Number, default: 0 },
      content: { type: Array, default: [] },
      mouse: { type: Object },
    };

    component.data = function () {
      return { };
    };

    component.watch = {
      current: function (val) {
        this.go(val);
        this.prev = val;
      }
    };


    component.components = { };


    // Init
    
    component.created = function () {

      this.prev = 0;

      this.parallax = { x: 0, y: 0 };

    };

    component.mounted = function () {

      this.stage = new Paper.Project(this.$refs.canvas);
      this.view = this.stage.view;
      this.view.viewSize = new Paper.Size(sw, sh);

      this.container = new Paper.Group();
      this.covers = this.drawCovers(this.container);

      this.shape = new Paper.CompoundPath();
      this.shape.fillColor = "#000";
      this.container.insertChild(0, this.shape);
      this.container.clipped = true;

      this.draw();
      this.shape.children = _.cloneDeep(this.models[this.current].children);
      this.covers[this.current].opacity = 1;
      
      let bounds = this.models[this.current].bounds.expand(tracker.s);
      this.position(bounds);

      new Ticker().tick('letter.animation', this.animate);
      $(window).on('resize', () => { console.log('coucou'); });

      this.view.update();

    };


    // Draw
    
    component.methods.draw = function () {

      this.models = [];
      _.each(this.content, (c) => {
        this.models.push(this.drawModel(c));
      });

    };

    component.methods.drawModel = function (c) {

      var m = new Paper.CompoundPath(c.letter.path);
      m.fitBounds(this.getModelFitter(c.letter.size));

      m.position.x = sw*.5 - m.bounds.width*(1-c.letter.offset.x) - 25;
      m.position.y = sh*.5 - m.bounds.height*c.letter.offset.y;
      m.x = m.position.x;
      m.y = m.position.y;
      m.w = m.bounds.width;
      m.h = m.bounds.height;

      _.each(m.children, (ch, i) => {
        _.each(ch.segments, (s, j) => {
          [s.point, s.handleIn, s.handleOut].forEach(p => {
            p.ox = p.x; p.oy = p.y;
          });
        });
      });

      return m;

    };
    
    component.methods.resize = function () {

      console.log('coucou');

      // this.draw();

    };


    // Transition
    
    component.methods.go = function (i) {
      
      let bounds = this.models[this.current].bounds.expand(tracker.s);
      this.position(bounds);

      this.morph(i);
      this.goCover(i);

    };


    // Animate
    
    component.methods.animate = function (f) {

      this.parallax.x += (this.mouse.orth.x*tracker.p - this.parallax.x) * .1;
      this.parallax.y += (this.mouse.orth.y*tracker.p - this.parallax.y) * .1;

      let distorsion = this.content[this.current].letter.distorsion;

      _.each(this.shape.children, (c) => {
        _.each(c.segments, (s, i) => {
          s.point.x = s.point.ox - this.bounds.x + this.parallax.x + Math.cos(f.count*distorsion.frequency + i) * distorsion.amplitude;
          s.point.y = s.point.oy - this.bounds.y + this.parallax.y - Math.sin(f.count*distorsion.frequency + i) * distorsion.amplitude;
          [s.handleIn, s.handleOut].forEach((p) => {
            p.x = p.ox; p.y = p.oy;
          });
        });
      });

    };


    // Utils
    
    component.methods.getModelFitter = function (size) {

      let x = 0;
      let y = sh*(1-size)/2;
      let w = sw;
      let h = sh*size;

      return new Paper.Rectangle({
        point: [x, y],
        size: [w, h]
      });

    };


    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    .home-backgroundLetter
      canvas(ref="canvas")

  </template>


  <style lang="stylus" scoped>

    .home-backgroundLetter
      position absolute
      z-index 500
      filter url(#organic)

      canvas
        position absolute

  </style>
  