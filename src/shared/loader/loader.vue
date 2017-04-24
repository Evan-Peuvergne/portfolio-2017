<script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';

    import { TimelineMax } from 'gsap';
    import Paper from 'paper';
    import Preloader from 'preload-js';

    import Assets from './assets.json';

    import StageStore from '../stage/store.js';


    
    /* Component */

    var component = { 
      name: 'loader', 
      methods: {},
      mixins: []
    };


    // Properties
    
    component.props = {
      // shape: { type: Object },
    };

    component.data = function () {
      return {
        state: 'Loading',
        target: 'images',
        percentage: 0
      };
    };

    component.watch = {
      percentage: function (val) {
        this.bar.size.width = (this.bar.ow*val)/100;
        this.bar.position.x = sw*.5 - (this.bar.ow - this.bar.size.width)*.5;
        this.bar.radius = 3;
        this.shape.children[0] = this.bar.toPath(false);
        Paper.project.view.update();
      }
    };

    component.components = {};


    // Hooks
    
    component.created = function () {

      StageStore.active = true;

      this.shape = StageStore.shape;

      this.preloader = new Preloader.LoadQueue({ loadNow: false });
      
      this.preloader.on('progress', this.progress);
      this.preloader.on('fileload', this.step);

      this.tween = TweenMax.to(this, 1, { 
        percentage: 0, 
        onUpdate: () => { this.percentage = Math.ceil(this.percentage); },
        onComplete: () => { if(this.percentage >= 100){ this.complete(); } },
      });

    };

    component.mounted = function () {

      let commons = Assets;
      let specs = {};
      
      this.assets = {};
      _.union(_.keys(commons), _.keys(specs)).forEach(k => {
        this.assets[k] = _.union(commons[k], specs[k]);
      });
      _.each(this.assets, (g, n) => {
        _.each(g, (f, i) => {
          this.preloader.loadFile({ id: n, src: f });
        });
      });

      this.bar = new Paper.Shape.Rectangle();
      this.bar.width = 0;

      this.draw();
      $(window).on('resize', this.resize);

      this.preloader.load();

    };


    // Frame
    
    component.methods.draw = function () {

      this.bar.ow = (sw >= 400) ? 300 : sw - 80;
      this.bar.size.height = 6;
      this.bar.radius = 3;

      this.bar.position.x = sw*.5 - this.bar.ow*.5;
      this.bar.position.y = sh*.5;
      this.shape.children[0] = this.bar.toPath(false);

    };

    component.methods.resize = function () {

      this.bar.position.x = sw*.5 - (this.bar.ow - this.bar.size.width)*.5;
      this.shape.children[0] = this.bar.toPath();

    };


    // Events
    
    component.methods.progress = function (e) {

      this.tween.updateTo({ percentage: e.progress*100 }, true);

    };

    component.methods.step = function (e) {

      let id = e.item.id;
      if(this.target != id){ this.target = id; }

    };

    component.methods.complete = function () {

      $(this.$refs.container).addClass('loaded');

      TweenMax.staggerFromTo(
        [ this.$refs.label, this.$refs.progress, ], .5, 
        { y: 0, opacity: 1 }, 
        { y: -12, opacity: 0, ease: ease.default, }, .125);

      this.shape.children[0].flatten(0.05);

      this.shape.children[0].segments.forEach(s => {
        [s.point, s.handleIn, s.handleOut].forEach(p => {
          p.ox = p.x; p.oy = p.y;
        });
        s.smooth();
      });

      this.$events.emit('loaded');

    };

    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    //- Root
    .loader

      .loader-container(ref="container")

        //- Label
        .loader-label(ref="label")
          p.loader-labelState(ref="state") {{ state }}
          p.loader-labelTarget(ref="target") {{ target }}

        //- Progress
        p.loader-progress(ref="progress") {{ percentage }}
    

  </template>


  <style lang="stylus" scoped>
    
    .loader
      display block
      position fixed
      top 0
      left 0
      width 100%
      height 100%
      font-size 2.3em

    .loader-container
      display flex
      flex-direction row
      width 300px
      position absolute
      top 50%
      margin-top 40px
      left 50%
      padding 0 0 0 3px
      transform translate3d(-50%, -50%, 0)

    .loader-container:before
      display block
      content ''
      position absolute
      z-index -1000
      top -25px
      left 0
      width 100%
      height 6px
      border-radius 3px
      background #f0f0f0

    .loader-container.loaded:before
      display none

    .loader-label
      display flex
      flex-direction column
      justify-content space-between
      flex 1
      padding 0.45em 0 0.1em 0
      font-family "Gotham Bold"
      font-size 0.4em
      text-transform uppercase

    .loader-labelState
      display block
      color #4a4a4a
      letter-spacing 0.15em

    .loader-labelTarget
      display block
      font-size 0.7em
      color #7c7c7c
      letter-spacing 0.1em

    .loader-progress
      display block
      font-family "Bodoni 72"
      font-weight 600
      font-size 1em
      color #e8e8e8
      letter-spacing 0.1em

  </style>
  