


  <script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';
    import { TweenMax } from 'gsap';

    import SVG from 'svg.js';
    import Paper from 'paper';

    import Ticker from '../../../shared/helpers/ticker.js';

    import Projects from '../projects.json';



    
    /* Component */

    var component = { name: 'tracker', methods: {} };


    // Properties
    
    component.props = {
      current: { type: Number, default: 0 },
      mouse: { type: Object }
    };

    component.data = function () {
      return {
        // shape: null,
      };
    };

    component.watch = {
      current: function (val) {
        // this.go(val);
        this.prev = val;
      }
    };


    // Init
    
    component.created = function () {

      this.shape = null;

      this.position = { x: 0, y: 0 };

    };

    component.mounted = function () {
      
      this.svg = SVG.adopt(this.$el);
      
      new Ticker().tick('tracker.animate', this.animate);   

    };


    // Draw
    
    component.methods.draw = function () {

      this.shape.flatten(4);
      this.shape.smooth();

      this.shape.segments.forEach(s => {
        [s.point, s.handleIn, s.handleOut].forEach(p => {
          p.ox = p.x; p.oy = p.y;
        });
      });

    };
    
    component.methods.resize = function () {

      

    };


    // Transition
    
    component.methods.go = function (i) {

            

    };


    // Animations
    
    component.methods.animate = function (f) {

      if(this.shape == null){ return false; }
  
      this.position.x += ((this.mouse.abs.x - tracker.s*.5) - this.position.x) * .2;
      this.position.y += ((this.mouse.abs.y - tracker.s*.5) - this.position.y) * .2;

      this.shape.segments.forEach((s, i) => {
        s.point.x = s.point.ox + this.position.x + Math.cos(f.time*tracker.distorsion.f + i) * tracker.distorsion.a;
        s.point.y = s.point.oy + this.position.y - Math.sin(f.time*tracker.distorsion.f + i*i) * tracker.distorsion.a;
      })

      this.svg.attr('d', this.shape.pathData);
      Paper.project.view.update();

    };


    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
      
      path.home-stageTracker(d="")

  </template>
  