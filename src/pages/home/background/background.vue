


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


    component.components = { 
      Tracker,
      Shade
    };


    // Init
    
    component.created = function () {

      this._trackerLocation = 'window';

      this.models = [];

    };

    component.mounted = function () {

      this.stages.l.activate();
      this.shape = new Paper.CompoundPath();
      this.shape.fillColor = '#000';
      this.shape.strokeWidth = 0;
      this.shape.shadowColor = '#000';
      this.shape.shadowBlur = '50';

      this.define = new Paper.SymbolDefinition(this.shape);

      this.mask = new Paper.SymbolItem(this.define);
      this.stages.s.activate();
      this.shadow = new Paper.SymbolItem(this.define);
      this.shadow.sendToBack();

      this.stages.l.activate();
      this.container.insertChild(0, this.mask);
      this.container.clipped = true;

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

      this.launch(this.current);

    };


    // Launch
    
    component.methods.launch = function (i = 0) {

      this.shape.fillColor = this.content[i].shadow.color;
      this.shape.shadowColor = this.content[i].shadow.color;

      this.shape.children = _.cloneDeep(this.models[i].children);
      this.covers[i].opacity = 1;

      this.bounds = this._calculateBounds(i);
      this.views.l.viewSize = this.bounds.size;
      this.views.s.viewSize = this.bounds.size;
      TweenMax.set([this.$refs.container, this.views.s.element], {
        left: this.bounds.x, top: this.bounds.y,
        width: this.bounds.width, height: this.bounds.height
      });

      let offsetX = sw*.5 - this.bounds.left;
      let offsetY = sh*.5 - this.bounds.top;
      this.covers[i].position.x = offsetX;
      this.covers[i].position.y = offsetY;

      new Ticker().tick('letter.animation', this._animate);

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

      this.views.l.update();
      this.views.s.update();

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
      canvas.background-shadow(ref="canvasShadow")
      
      tracker(v-bind:current="current", v-bind:content="content", v-bind:mouse="mouse", ref="tracker")

      shade(v-bind:current="current", v-bind:content="content", v-bind:mouse="mouse", ref="shade")

      svg(width="100%", height="100%")
        defs
          filter(id="organic")
            feGaussianBlur(in="SourceGraphic" stdDeviation="8" result="blur")
            feColorMatrix(in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo")
            feComposite(in="SourceGraphic" in2="goo" operator="atop")

          filter(id="shadow1")
              feGaussianBlur(in="SourceAlpha", stdDeviation="0")
              feOffset(dx="4", dy="4", result="offsetblur")
              feComponentTransfer
                feFuncA(type="linear", slope="0.2")
              feMerge
                feMergeNode
                feMergeNode(in="SourceGraphic")

          filter(id="shadow2")
            feOffset(dx="0", dy="0", result="offset", in="SourceGraphic")
            feGaussianBlur(stdDeviation="20", result="blur", in="offset")
            feBlend(in="SourceGraphic", in2="blur", mode="lighten")

          filter(id="shadow3")
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
      filter url(#shadow3)

    .background-shadeCanvas
      z-index 50

    .background-letter
      position absolute
      z-index 200
      /*background rgba(#ff0000, 0.05)*/
      filter: url(#organic)

    .background-letterCanvas
      /*position fixed*/
      position absolute
      top 0
      left 0
      width 100%
      height 100%

    .background-shadow
      position absolute
      visibility hidden
      /*background rgba(#000, 0.1)*/

  </style>
  