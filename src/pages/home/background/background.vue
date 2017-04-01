


  <script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';
    import Paper from 'paper';

    import Tracker from './tracker.vue';
    import Shade from './shade.vue';
    
    import Mixins from './mixins';

    import Ticker from '../../../shared/helpers/ticker.js';

    import Projects from '../projects.json';


    
    /* Component */

    var component = { 
      name: 'background', 
      methods: {},
      mixins: [ Mixins.Covers, Mixins.Letter, Mixins.Distorsion ]
    };


    // Properties
    
    component.props = {
      current: { type: Number, default: 0 },
      content: { type: Array, default: [] },
      mouse: { type: Object},
    };

    component.data = function () {
      return { 
        length: this.content.length,
        organic: sh/85,
      };
    };

    component.watch = {
      current: function (val) {
        this.go(val);
        this.prev = val;
      }
    };


    component.components = { 
      Tracker,
      Shade
    };


    // Init
    
    component.created = function () {

      this._trackerLocation = 'container';

    };

    component.mounted = function () {

      this.shape = new Paper.CompoundPath();
      this.shape.fillColor = '#000';
      this.container.insertChild(0, this.shape);
      this.container.clipped = true;

      this.draw();

      new Ticker().tick('letter.animation', this._animate);
      $(window).on('resize', () => { this.resize(); });

    };


    // Draw
    
    component.methods.draw = function () {

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

        _.each(model.children, (c, i) => {
          _.each(c.segments, (s, j) => {
            s.point.ox = s.point.x;
            s.point.oy = s.point.y;
            s.handleIn.ox = s.handleIn.x;
            s.handleIn.oy = s.handleIn.y;
            s.handleOut.ox = s.handleOut.x;
            s.handleOut.oy = s.handleOut.y;
          });
        });

        this.models.push(model);
      });

      this.shape.children = _.cloneDeep(this.models[this.current].children);
      this.bounds = this._calculateBounds(this.current);
      this.view.viewSize = this.bounds.size;
      TweenMax.set(this.$refs.container, {
        left: this.bounds.x, top: this.bounds.y,
        width: this.bounds.width, height: this.bounds.height
      });

      this.covers[this.current].position.x = sw*.5 - this.bounds.left;
      this.covers[this.current].position.y = sh*.5 - this.bounds.top;

    };
    
    component.methods.resize = function () {

      this.view.viewSize.width = sw;
      this.view.viewSize.height = sh;

      this.organic = sh/85;

      this.draw();

    };


    // Transition
    
    component.methods.go = function (i) {

      this.bounds = this._calculateBounds(i);
      this.view.viewSize = this.bounds.size;
      TweenMax.set(this.$refs.container, {
        left: this.bounds.x, top: this.bounds.y,
        width: this.bounds.width, height: this.bounds.height
      });

      let offsetX = sw*.5 - this.bounds.left;
      let offsetY = sh*.5 - this.bounds.top;
      this.covers[i].position.x = offsetX;
      this.covers[i].position.y = offsetY;

      this._morph(i);
      this._coversTransition(i);

    };


    // Animate
    
    component.methods._animate = function (f) {

      this.parallax.x += (this.mouse.orth.x*tracker.p - this.parallax.x) * .1;
      this.parallax.y += (this.mouse.orth.y*tracker.p - this.parallax.y) * .1;

      let distorsion = this.content[this.current].letter.distorsion;

      _.each(this.shape.children, (c) => {
        _.each(c.segments, (s, i) => {
          s.point.x = s.point.ox - this.bounds.x + this.parallax.x + Math.cos(f.count*distorsion.frequency + i) * distorsion.amplitude;
          s.point.y = s.point.oy - this.bounds.y + this.parallax.y - Math.sin(f.count*distorsion.frequency + i) * distorsion.amplitude;
          s.handleIn.x = s.handleIn.ox;
          s.handleIn.y = s.handleIn.oy;
          s.handleOut.x = s.handleOut.ox;
          s.handleOut.y = s.handleOut.oy;
        });
      });

      // this.view.update();
      this._transfer();

    };

    component.methods._transfer = function () {

      let cursor = new Paper.Rectangle({
        point: [this.mouse.abs.x-tracker.r, this.mouse.abs.y-tracker.r],
        size: [tracker.d, tracker.d]
      });

      let isInContainer = this.bounds.contains(cursor);

      if(isInContainer && this._trackerLocation != 'container') {
        this._trackerLocation = 'container';
        this.$refs.container.appendChild(this.$refs.tracker.$el);
        return;
      }

      if(!isInContainer && this._trackerLocation != 'window') {
        this._trackerLocation = 'window';
        this.$el.appendChild(this.$refs.tracker.$el);
        return;
      }

    };


    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    div.home-background

      .background-letter(ref="container")
        canvas.background-letterCanvas(ref="canvas")
        tracker(v-bind:current="current", v-bind:content="content", v-bind:mouse="mouse", ref="tracker")

      shade(v-bind:current="current", v-bind:content="content", v-bind:mouse="mouse", ref="shade")

      svg(width="100%", height="100%")
        defs
          filter(id="organic")
            feGaussianBlur(in="SourceGraphic" v-bind:stdDeviation="organic" result="blur")
            feColorMatrix(in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 17 -7" result="goo")
            feComposite(in="SourceGraphic" in2="goo" operator="atop")

          filter(id="shadow")
            feOffset(dx="0", dy="0", result="offset", in="SourceGraphic")
            feGaussianBlur(stdDeviation="20", result="blur", in="offset")
            feComponentTransfer
              feFuncA(type="linear", slope="0.6")
            feMerge
              feMergeNode
              feMergeNode(in="SourceGraphic")


  </template>


  <style lang="stylus">

    .home-background
      position relative
      width 100%
      height 100%
      /*filter url(#shadow)*/

    .background-shadeCanvas
      z-index 50

    .background-letter
      position absolute
      z-index 200
      filter url(#organic)

    .background-letterCanvas
      position absolute
      top 0
      left 0
      width 100%
      height 100%

  </style>
  