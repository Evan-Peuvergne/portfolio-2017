


  <script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';

    import { TimelineMax } from 'gsap';

    import Paper from 'paper';

    import Ticker from '../../../shared/helpers/ticker.js';

    import Projects from '../projects.json';


    
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
      models: { type: Array }
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

      this.tl = new TimelineMax();

    };

    component.mounted = function () {

      this.stage = new Paper.Project(this.$el);
      this.view = this.stage.view;
      this.view.autoUpdate = true;

      this.stage.activeLayer.addChildren([this.letter, this.tracker]);

      let settings = Projects[this.current];
      this.letter.fillColor = settings.shadow.color;
      this.letter.shadowColor = settings.shadow.color;
      this.letter.shadowBlur = 60;
      this.letter.opacity = settings.shadow.opacity;

      this.tracker.fillColor = settings.shadow.color;
      this.tracker.shadowColor = settings.shadow.color;
      this.tracker.shadowBlur = 50;
      this.tracker.opacity = settings.shadow.opacity - 0.15;

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

      let anims = {
        fillColor: Projects[i].shadow.color,
        shadowColor: Projects[i].shadow.color, 
        opacity: Projects[i].shadow.opacity,
        ease: ease.default
      };

      this.tl.clear();
      this.tl.to(this.letter, .6, _.clone(anims), 0);
      this.tl.to(this.tracker, .6, _.clone(anims), 0);

    };


    // Animate
    
    component.methods.animate = function (f) {

      this.view.update();

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