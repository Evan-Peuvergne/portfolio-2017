


  <script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';

    import SVG from 'svg.js';
    import Paper from 'paper';

    import Ticker from '../../../shared/helpers/ticker.js';

    import Projects from '../projects.json';


    
    /* Component */

    var component = { 
      name: 'letter', 
      methods: {},
      mixins: []
    };


    // Properties
    
    component.props = {
      current: { type: Number, default: 0 },
      shapes: { type: Array, default: [] },
      content: { type: Array, default: [] },
      mouse: { type: Object }
    };

    component.data = function () {
      return {
        shape: null,
      };
    };

    component.watch = {
      current: function (val) {
        this.define(this.shapes[val]);
        this.prev = val;
      }
    };

    component.components = {};


    // Hooks
    
    component.created = function () {

      this.parallax = { x: 0, y: 0 };

    };

    component.mounted = function () {

      this.letter = SVG.adopt(this.$el);

      new Ticker().tick('letter.animation', this.animate);

    };


    // Draw
    
    component.methods.draw = function () {

      

    };

    component.methods.resize = function () {



    };


    // Animate
    
    component.methods.animate = function (f) {
      
      if(this.shape == null){ return false; }

      this.parallax.x += (this.mouse.orth.x*tracker.p - this.parallax.x) * .1;
      this.parallax.y += (this.mouse.orth.y*tracker.p - this.parallax.y) * .1;

      let distorsion = this.content[this.current].letter.distorsion;

      this.shape.children.forEach(c => {
        c.segments.forEach((s, i) => {
          s.point.x = s.point.ox + this.parallax.x + Math.cos(f.count*distorsion.frequency + i) * distorsion.amplitude;
          s.point.y = s.point.oy + this.parallax.y - Math.sin(f.count*distorsion.frequency + i) * distorsion.amplitude;
        });
      });

      this.letter.attr('d', this.shape.pathData);
      // console.log(this.shape.pathData);

      // console.log(this.sh)

    };


    // Utils
    
    component.methods.define = function (shape) {

      this.shape = shape.clone();

      this.shape.children.forEach(c => {
        c.segments.forEach(s => {
          [s.point, s.handleIn, s.handleOut].forEach(p => {
            p.ox = p.x; p.oy = p.y;
          });
        });
      });

    };


    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    path.home-stageLetter

  </template>


  <style lang="stylus">



  </style>
  