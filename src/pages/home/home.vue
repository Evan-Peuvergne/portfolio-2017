

  <script>

    
    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';

    import Paper from 'paper';
    import { TimelineMax } from 'gsap';
    import Ticker from '../../vendors/helpers/ticker.js';

    import Titles from './titles.vue';
    import Navigation from './navigation.vue';

    import StageStore from '../../shared/stage/store.js';

    import Morphing from '../../shared/stage/morphing.js';
    import Shades from '../../shared/stage/shades.js';
    import Transitions from '../../shared/transitions.js';

    import Projects from '../../shared/projects.json';
    import Animations from './animations.json';
    import AppStore from '../../shared/app/store.js';


    
    /* Component */

    var component = { name: 'home', methods: {} };


    // Properties
    
    component.props = {};
    
    component.data = function () {
      return {
        title: 'Evan Peuvergne | Projects',
        current: 0,
        prev: 0,
        mouse: StageStore.mouse,
        app: AppStore.is,
        animations: Animations,
      }
    };

    component.computed = {};

    component.components = { Titles, Navigation };

    component.mixins = [ Morphing, Shades, Transitions ];


    // Init
    
    component.created = function () {

      this.parallax = { x: 0, y: 0 };

      this.model = StageStore.model;
      this.tracker = StageStore.tracker;

      this.models = [];

      this.timeline = new TimelineMax();

    };
    
    component.mounted = function () {

      this.titles = this.$refs.titles;
      this.navigation = this.$refs.navigation;

      Projects.forEach(p => {
        this.models.push(new Paper.CompoundPath(p.letter.path));
      });

      this.draw();

      $(window).on('keydown', this.keydown);
      $(window).on('resize', this.resize);

      new Ticker().tick('home.animation', this.animate);

      this.$events.on('loaded', () => { 
        this.enter(this.getTransitionSettings('entering', 'initial')); 
      });

      this.$events.on('home.previous', this.previous);
      this.$events.on('home.next', this.next);

    };


    // Draw
    
    component.methods.draw = function () {

      this.models.forEach((m, i) => {

        let settings = Projects[i].letter;
        let fitter = new Paper.Rectangle({
          point: [0, sh*(1-settings.size)/2],
          size: [sw, sh*settings.size]
        });
        m.fitBounds(fitter);

        m.position.x = sw*.5 - m.bounds.width*(1-settings.offset.x) - 25;
        m.position.y = sh*.5 - m.bounds.height*settings.offset.y;

        m.children.forEach(c => { c.segments.forEach(s => {
          [s.point, s.handleIn, s.handleOut].forEach(p => {
            p.ox = p.x; p.oy = p.y; });
        }); });

      });

      this.drawShades(this.models, 
        _.map(Projects, (p) => { return p.shade; }));

    };


    // Transitions
    
    component.methods.enter = function (settings) {

      StageStore.sourcing = true;
      StageStore.parallaxing = true;
      StageStore.distording = true;
      
      StageStore.covers.default = false;
      StageStore.covers.items[this.current].active = true;
      StageStore.cover = Projects[this.current].id;

      let morphs = Morphing.generate(this.model, this.models[this.current], { 
       start: settings.anchor, 
      });

      Morphing.run(this.timeline, this.model, morphs, settings.morphing);

      TweenMax.to(this.shades[this.current], .6, { opacity: 0.02, ease: ease.default });

      TweenMax.to([this.model, this.tracker], .6, StageStore.getShadow(Projects[this.current].shadow));

      this.$refs.titles.enter();
      this.$refs.navigation.enter();

    };

    component.methods.leave = function () {

      let timeline = new TimelineMax({ 
        onComplete: () => {

          new Ticker().remove('home.animation');

          $(window).off('keydown', this.keydown);
          $(window).off('resize', this.resize);

          this.$events.off('loaded');
          this.$events.off('home.previous');
          this.$events.off('home.next');

        } 
      });

      timeline.to(this.shades[this.current], .6, { opacity: 0, ease: ease.default, }, 0);

      this.titles.leave();
      this.navigation.leave();

    };


    // Animation
    
    component.methods.animate = function (f) {

      this.parallax.x += (StageStore.mouse.orth.x*shade.p.x - this.parallax.x) * .15;
      this.parallax.y += (StageStore.mouse.orth.y*shade.p.y - this.parallax.y) * .15;

      this.shades.forEach(s => {
        s.position.x = s.x + this.parallax.x;
        s.position.y = s.y + this.parallax.y;
      });

    };


    // Events
    
    component.methods.keydown = function (e) {

      switch(e.keyCode) {
        case 37: this.previous(); break;
        case 39 : this.next(); break;
      }

    };

    component.methods.resize = function (e) {

      if(!this.app.loaded){ return false; }

      this.draw();

      this.model.children = _.cloneDeep(this.models[this.current].children);

    };


    // Navigation
    
    component.methods.go = function (i) {

      if(!this.app.loaded){ return false; }

      this.prev = this.current;
      this.current = i;

      StageStore.cover = Projects[this.current].id;

      Morphing.clear(this.model, this.models[this.prev]);

      let morphs = Morphing.generate(this.model, this.models[i], { 
        start: Projects[this.current].letter.transition.origin, 
      });

      Morphing.run(this.timeline, this.model, morphs, {
        duration: .7,
        step: .005
      });

      this.timeline.to([this.model, this.tracker], .6, StageStore.getShadow(Projects[this.current].shadow), 0);

      this.changeShade(this.shades[this.prev], this.shades[this.current]);

    };
    
    component.methods.previous = function () { 

      var i = this.current-1; 
      i = (i >= 0) ? i : Projects.length-1;

      this.go(i);

    };  
    
    component.methods.next = function () { 
      
      let i = (this.current+1)%Projects.length;

      this.go(i);

    };



    /* Export */

    export default component;
    

  </script>


  <template lang="jade">
    
    //- Root
    .home
      
      //- Titles
      titles(v-bind:current="current" v-bind:mouse="mouse" ref="titles")

      //- Navigation
      navigation(v-bind:mouse="mouse" v-bind:current="current" ref="navigation")

  </template>


  <style lang="stylus" scoped>

    .home
      display block
      position absolute
      top 0
      left 0
      width 100%
      height 100%

      .titles
        position absolute
        z-index 1500
        top calc(50% - 2.5em)
        left 50%
        width 50%
        height 50%

      .navigation
        position absolute
        z-index 1600
        top 0
        left 0
        width 100%
        height 100%

  </style>
  