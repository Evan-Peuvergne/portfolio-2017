


  <script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';
    import { TweenMax } from 'gsap';

    import Paper from 'paper';

    import Mixins from './mixins.js';
    import Tracker from './tracker.vue';

    import S from '../../../shared/helpers/sizes.js';
    import Ticker from '../../../shared/helpers/ticker.js';



    
    /* Component */

    var component = { name: 'tracker', methods: {} };


    // Mixins
    
    component.mixins = [ Mixins.Covers, Mixins.Distorsion ];


    // Properties
    
    component.props = {
      current: { type: Number, default: 0 },
      content: { type: Array, default: [] },
      mouse: { type: Object },
    };

    component.data = function () {
      return { 
        bounds: { top: '0px', left: '0px', width: '100%', height: '100%' }, 
        length: this.content.length,
      };
    };

    component.watch = {
      current: function (val) {
        this.go(val);
        this.prev = val;
      }
    }

    component.components = {
      Tracker
    };


    // Init

    component.mounted = function () {

      this.shape = new Paper.CompoundPath();
      this.shape.fillColor = '#000';
      this.container.insertChild(0, this.shape);
      this.container.clipped = true;

      this.models = [];
      _.each(this.content, (c, i) => {
        let model = new Paper.CompoundPath(c.letter.path);
        model.fitBounds(new Paper.Rectangle({
          point: [ 0, sh*(1-c.letter.size)/2 ], size: [ sw, sh*c.letter.size ] 
        }));
        model.position.x = sw*.5 - model.bounds.width*(1-c.letter.offset.x) - 25;
        model.position.y = sh*.5 - model.bounds.height*c.letter.offset.y;
        model.x = model.position.x;
        model.y = model.position.y;
        model.w = model.bounds.width;
        model.h = model.bounds.height;
        this.models.push(model);
      });

      this.launch();

    };


    // Launch
    
    component.methods.launch = function () {

      this.prev = this.current;

      this.shape.children = _.cloneDeep(this.models[0].children);
      this.covers[0].opacity = 1;

      this._calculateBounds();

      new Ticker().tick('letter.distorsion', (f) => {
        this._distord(f);
      });

    };


    // Transition
    
    component.methods.go = function (i) {



    };


    // Utils
    
    component.methods._calculateBounds = function () {

      let width = this.models[this.current].w + 50 + sh*0.07*4;
      let height = this.models[this.current].h + 50 + sh*0.07*4;

      this.bounds.width = (width) + 'px';
      this.bounds.height = (height) + 'px';
      this.bounds.left = (this.models[this.current].x - width*.5) + 'px';
      this.bounds.top = (this.models[this.current].y - height*.5) + 'px';

    };


    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    .background-letterContainer(ref="container", v-bind:style="bounds")
      canvas.background-letterCanvas(ref="canvas")
      tracker(v-bind:current="current", v-bind:content="content", v-bind:mouse="mouse", ref="tracker")

  </template>


  <style lang="stylus">

      .background-letterContainer
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        overflow hidden
        /*filter url(#organic)*/
        overflow hidden

      .background-letterCanvas
        position fixed
        top 0
        bottom 0
        left 0
        right 0

  </style>
  