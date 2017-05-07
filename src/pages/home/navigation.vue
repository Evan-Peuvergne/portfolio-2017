

  <script>

    
    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';

    import Paper from 'paper';
    import { TimelineMax } from 'gsap';
    import Ticker from '../../vendors/helpers/ticker.js';

    import Projects from './projects.json';
    import StageStore from '../../shared/stage/store.js';


    
    /* Component */

    var component = { name: 'navigation', methods: {} };

    var size = .2;


    // Properties
    
    component.props = {
      mouse: { type: Object },
      current: { type: Number }
    };
    
    component.data = function () {
      return {
        projects: Projects,
        active: { previous: false, next: false }
      };
    };

    component.computed = {
      color: function () {
        return this.projects[this.current].color;
      },
      url: function () {
        return this.projects[this.current].url;
      }
    }

    component.components = {};


    // Init
    
    component.created = function () {

      

    };
    
    component.mounted = function () {

      this.areas = {
        previous: new Paper.Rectangle(),
        next: new Paper.Rectangle()
      };

      this.parallax = {
        previous: { x: 0, y: 0, },
        next: { x: 0, y: 0 }
      };

      this.draw();

      $(window).on('resize', this.resize);
      $(window).on('click', this.click);

      new Ticker().tick('navigation.animate', this.animate);
      
      StageStore.view.update();

    };


    // Draw
    
    component.methods.draw = function () {

      ['previous', 'next'].forEach((a, i) => {

        this.areas[a].point = new Paper.Point((sw - (sw-600)*.5) * i, 0);
        this.areas[a].size = new Paper.Size((sw - 600)*.5, sh);

        this.parallax[a].x = (a == 'previous') ? this.areas[a].rightCenter.x : this.areas[a].leftCenter.x;
        this.parallax[a].y = sh*.5;

      });

    };

    component.methods.resize = function (e) {

      this.draw();

      StageStore.view.update();

    };


    // Animation
    
    component.methods.animate = function (f) {

      let position = new Paper.Point(this.mouse.abs.x, this.mouse.abs.y);
      
      _.each(this.areas, (a, k) => {
        this.active[k] = a.contains(position);
      });

      _.each(this.active, (a, k) => {
        if(a){

          this.parallax[k].x += (this.mouse.abs.x - this.parallax[k].x) * .175;
          this.parallax[k].y += (this.mouse.abs.y - this.parallax[k].y) * .175;

          TweenMax.set(this.$refs[k], 
            { x: this.parallax[k].x, y: this.parallax[k].y });

        }
      })

    };


    // Events
    
    component.methods.click = function (e) {
      if(this.active.previous || this.active.next){

        e.preventDefault();

        if(this.active.previous){ this.$events.emit('home.previous'); }
        else{ this.$events.emit('home.next'); }

      }
    };


    // Transitions
    
    component.methods.enter = function () {

      let t = new TimelineMax();

      console.log(this.$refs.arrow);

      t.fromTo(this.$refs.arrowPrevious, .6, 
        { visibility: 'visible', x: -100, opacity: 0 },
        { x: 0, opacity: 1, ease: ease.elashard }, .5);

      t.fromTo(this.$refs.arrowNext, .6, 
        { visibility: 'visible', x: 100, opacity: 0 },
        { x: 0, opacity: 1, ease: ease.elashard }, .7);

      t.fromTo(this.$refs.access, .6, 
        { visibility: 'visible', y: 100, opacity: 0 },
        { y: 0, opacity: 1, ease: ease.elashard }, .8);

    };

    component.methods.leave = function () {

      let t = new TimelineMax({
        onComplete: function () {
          
          $(window).off('resize', this.resize);
          new Ticker().remove('navigation.animate');

        }
      });

      t.fromTo(this.$refs.previous, .6, 
        { x: 0, opacity: 1 },
        { x: -100, opacity: 0, ease: ease.elasoft }, 0);

      t.fromTo(this.$refs.next, .6, 
        { x: 0, opacity: 1 },
        { x: 100, opacity: 0, ease: ease.elashard }, .1);

      t.fromTo(this.$refs.access, .6, 
        { y: 0, opacity: 1 },
        { y: 100, opacity: 0, ease: ease.elashard }, .2);

    };



    /* Export */

    export default component;
    

  </script>


  <template lang="jade">
    
    //- Root
    .navigation(v-bind:style="{ cursor: (this.active.previous || this.active.next) ? 'pointer' : 'default' }")

      //- Previous
      a.navigation-arrow.navigation-previous(ref="arrowPrevious" v-bind:style="{ opacity: active.previous ? 0 : 1 }")
        img(src="assets/icons/previous.svg")
      
      div.navigation-symbol(v-bind:style="{ opacity: active.previous ? 0.8 : 0 }" ref="previous")
        img(src="assets/icons/previous_w.svg")
      
      //- Next
      a.navigation-arrow.navigation-next(ref="arrowNext" v-bind:style="{ opacity: active.next ? 0 : 1 }")
        img(src="assets/icons/next.svg")

      div.navigation-symbol(v-bind:style="{ opacity: active.next ? 0.8 : 0 }" ref="next")
        img(src="assets/icons/next_w.svg")

      //- Access
      a.navigation-access(v-bind:href="url" target="_blank" ref="access") Click <strong v-bind:style="{ color: color }">here</strong> to discover project

  </template>


  <style lang="stylus" scoped>

    .navigation-arrow
      display block
      position absolute
      top 50%
      width 1em
      opacity 1
      transition opacity 0.2s ease
      visibility hidden

      &.navigation-previous
        left 3.2em

      &.navigation-next
        right 3.2em

      img
        display block
        width 100%
        opacity 0.2

    .navigation-symbol
      display block
      position absolute
      z-index 2000
      opacity 0
      transition opacity 0.3s ease
      cursor pointer

      img
        display block
        width 1em
        height auto
        transform translate3d(-50%, -50%, 0)

    .navigation-access
      display block
      position absolute
      left 50%
      bottom 1em
      padding 2em
      font-family Gotham Bold
      font-size 0.75em
      color rgba(#000, 0.3)
      letter-spacing 0.1em
      text-transform uppercase
      text-align center
      text-decoration none
      cursor pointer
      transform translate3d(-50%, 0, 0)
      visibility hidden

      strong
        color #ff6631
        padding 3em
        margin -3em
        transition color 0.3s ease

        &:hover
          color rgba(#fefefe, 0.85) !important

  </style>
  