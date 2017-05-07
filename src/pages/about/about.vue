

  <script>

    
    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';

    import Paper from 'paper';
    import { TimelineMax } from 'gsap';
    import Ticker from '../../vendors/helpers/ticker.js';

    import StageStore from '../../shared/stage/store.js';

    import Morphing from '../../shared/stage/morphing.js';
    import Transitions from '../../shared/transitions.js';

    import Config from './config.json';


    
    /* Component */

    var component = { name: 'about', methods: {} };


    // Properties
    
    component.props = {};
    
    component.data = function () {
      return {
        title: 'Evan Peuvergne | About',
      }
    };

    component.computed = {};

    component.components = {};

    component.mixins = [ Transitions, ];


    // Init
    
    component.created = function () {

      this.model = new Paper.CompoundPath(Config.shape);

    };
    
    component.mounted = function () {

      this.contents = this.$refs.content.children;
      this.networks = this.$refs.networks.children;

      this.draw();

      this.$events.on('loaded', this.enter);

      $(window).on('resize', this.resize);

    };


    // Draw
    
    component.methods.draw = function () {

      let box = this.$refs.shape.getBoundingClientRect();
      let fitter = new Paper.Rectangle({
        point: [box.left, box.top],
        size: [box.width, box.height]
      });
      this.model.fitBounds(fitter);
      this.model.position.y -= sh*.01;

      this.model.children.forEach(c => {
        c.segments.forEach(s => {
          [s.point, s.handleIn, s.handleOut].forEach(p => {
            p.ox = p.x; p.oy = p.y;
          });
        });
      });

    };

    component.methods.resize = function (e) {

      this.draw(); 

      StageStore.model.children = _.cloneDeep(this.model.children);

    };


    // Transitions
    
    component.methods.enter = function () {

      StageStore.sourcing = true;
      StageStore.mousing = true;
      StageStore.parallaxing = false;
      StageStore.distording = true;

      let morphs = Morphing.generate(StageStore.model, this.model, { start: 0 });
      
      let timeline = new TimelineMax();
      Morphing.run(timeline, StageStore.model, morphs, {
        duration: .75,
        step: .01
      });

      StageStore.covers.default = false;
      StageStore.cover = 'about';

      TweenMax.staggerFromTo(this.contents, 1, 
        { y: 150, opacity: 0 },
        { y: 0, opacity: 1, ease: ease.elashard, }, .1);

      TweenMax.staggerFromTo(this.networks, 1, 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, ease: ease.elashard, delay: .3 }, .075);

      TweenMax.to([StageStore.model, StageStore.tracker], .75, StageStore.getShadow({ color: '4F5473', opacity: 0.4, }));

    };

    component.methods.leave = function () {

      TweenMax.staggerFromTo(_.reverse(this.contents), .85, 
        { y: 0, opacity: 1 },
        { y: -100, opacity: 0, ease: ease.elashard, }, .075);

      TweenMax.staggerFromTo(this.networks, .85, 
        { y: 0, opacity: 1 },
        { y: 100, opacity: 0, ease: ease.elashard, delay: .1 }, .075);

      $(window).off('resize', this.resize);

    };



    /* Export */

    export default component;
    

  </script>


  <template lang="jade">
    
    //- Root
    .about

      //- Shape
      .about-shape(ref="shape")

      //- Content
      .about-content(ref="content")
        p Hi, my name is Evan.
        p I'm a 21 y/o french <strong>webdesigner</strong>, focused on <strong>#product</strong> and <strong>#interactive</strong> design. Student in 4th year at <strong><a href="http://hetic.net">HETIC</a></strong>.
        p I'm also do some crazy prototypes with <strong>#framerjs</strong> or creative developments with <strong>#threejs</strong> and <strong>#shaders</strong>.
        p.about-contentPunchline I'm looking for a 6 months product design internship from July to December 2017 in the US.

      //- Networks
      ul.about-networks(ref="networks")
        li <a href="mailto:evanpeuvergne@gmail.com">Email</a>
        li <a href="https://www.linkedin.com/in/evanpeuvergne/" target="_blank">Linkedin</a>
        li <a href="https://twitter.com/vavouweb" target="_blank">Twitter</a>
        li <a href="https://www.behance.net/vavouweb" target="_blank">Behance</a>


  </template>


  <style lang="stylus" scoped>

    .about
      display flex
      position relative
      z-index 1200
      width 900px
      height 100%
      margin auto
      padding 6em 0 6em 0

      .about-shape
        display block
        width 40%
        height 100%
        margin 0 4em 0 0

      .about-content
        flex 1
        height 100%
        padding 1em 0 0 0

      .about-networks
        position absolute
        left 0
        bottom 1.5em
        width 100%


    .about-content
      display flex
      flex-direction column
      justify-content center
      font-family Gotham Medium
      font-size 1em
      color rgba(#000, 0.7)
      line-height 1.5
      
      p
        opacity 0
        margin 0 0 1em 0 

        strong
          font-family Gotham Bold
          color #000

        a
          color #000
          text-decoration none

      .about-contentPunchline
        font-family Gotham Bold
        font-size 0.95em
        color rgba(#4f5473, 0.7)
        margin 3em 0 0 0


    .about-networks
      text-align center

      li
        display inline-block
        vertical-align middle
        padding 2em
        opacity 0

        a
          font-family Gotham Medium
          font-size 0.9em
          color rgba(#000, 0.4)
          text-decoration none
          transition color 0.3s ease

        &:hover a
          color rgba(#fefefe, 0.8)


  </style>
  