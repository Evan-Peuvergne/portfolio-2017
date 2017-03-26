


  <script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';
    import Paper from 'paper';

    // import Letter from './letter.vue';
    import Tracker from './tracker.vue';
    
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
      mouse: { type: Object, default: { x: .5, y: .5 } }
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


    component.components = { Tracker };


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

      this.shape.children = _.cloneDeep(this.models[i].children);
      this.covers[i].opacity = 1;

      this.bounds = this._calculateBounds(i);
      this.view.viewSize = new Paper.Size(this.bounds.width, this.bounds.height);
      TweenMax.set(this.$refs.container, _.clone(this.bounds));

      new Ticker().tick('letter.animation', this._animate);

    };


    // Transition
    
    component.methods.go = function (i) {

      this.bounds = this._calculateBounds(i);
      this.view.viewSize = new Paper.Size(this.bounds.width, this.bounds.height);
      TweenMax.set(this.$refs.container, _.clone(this.bounds));

      this._morph(i);
      this._coversTransition(i);

    };


    // Animate
    
    component.methods._animate = function (f) {

      this.parallax.x += (this.mouse.x*50 - this.parallax.x) * .1;
      this.parallax.y += (this.mouse.y*50 - this.parallax.y) * .1;

      _.each(this.shape.children, (c) => {
        _.each(c.segments, (s, i) => {
          s.point.x = s.point.ox - this.bounds.left + this.parallax.x + Math.cos(f.count*.5 + i) * .25;
          s.point.y = s.point.oy - this.bounds.top + this.parallax.y - Math.sin(f.count*.5 + i) * .25;
          s.handleIn.x = s.handleIn.ox;
          s.handleIn.y = s.handleIn.oy;
          s.handleOut.x = s.handleOut.ox;
          s.handleOut.y = s.handleOut.oy;
        });
      });
      
      this.view.update();

    };


    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    div.home-background

      .background-letter(ref="container")
        canvas.background-letterCanvas(ref="canvas")
        //- tracker(v-bind:current="current", v-bind:content="content", v-bind:mouse="mouse")

      //- canvas.background-shadeCanvas

      svg(width="100%", height="100%")
        defs
          filter(id="organic")
            feGaussianBlur(in="SourceGraphic" stdDeviation="8" result="blur")
            feColorMatrix(in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo")
            feComposite(in="SourceGraphic" in2="goo" operator="atop")

  </template>


  <style lang="stylus">

    .home-background
      position relative
      width 100%
      height 100%

    .background-shadeCanvas
      z-index 50

    .background-letter
      position absolute
      /*background rgba(#ff0000, 0.1)*/
      filter: url(#organic)

    .background-letterCanvas
      /*position fixed*/
      position absolute
      top 0
      left 0
      width 100%
      height 100%

  </style>
  