

  <script>

    
    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';

    import Splitter from '../../vendors/libs/SplitText.js';
    import { TimelineMax } from 'gsap';

    import Ticker from '../../vendors/helpers/ticker.js';

    import Projects from './projects.json';


    
    /* Component */

    var component = { name: 'titles', methods: {} };


    // Properties
    
    component.props = {
      current: { type: Number, default: 0 },
      mouse: { type: Object },
    };
    
    component.data = function () {
      return {
        content: Projects,
      }
    };

    component.watch = {
      current: function (val) {
        this.go(val);
        this.prev = this.current;
      }
    }


    // Init
    
    component.created = function () {

      this.titles = [];
      this.prev = this.current;
      this.parallax = { x: 0, y: 0 };

    };
    
    component.mounted = function () {

      this.content.forEach((p, i) => {

        let t = { 
          container: this.$refs.containers[i],
          main: this.$refs.titles[i], 
          label: this.$refs.labels[i], 
          highlight: this.$refs.highlight[i],
        };

        t.main.innerHTML = t.main.innerHTML.replace(' ', '</br>');

        t.splitted = new Splitter(t.main, { type: 'lines,chars' });
        TweenMax.set(_.last(t.splitted.lines), { x: 20 });

        t.lm = t.hm = 0;

        t.splitted.chars.forEach((c, i) => {

          c.d = new Array(-1, 1)[i%2];
          c.oy = c.d * _.random(1, 2);
          c.or = c.d * _.random(1, 2);

          TweenMax.set(c, { 
            position: 'relative',
            top: c.oy, 
            rotation: c.or 
          });
          
        });

        t.timeline = new TimelineMax();

        this.titles.push(t);

      });

      new Ticker().tick('titles.animation', this.animate);

    };


    // Transition
    
    component.methods.go = function (i) {

      let from = this.titles[this.prev];
      let to = this.titles[i];

      let tl = to.timeline;
      tl.clear();
      
      tl.staggerFromTo(from.splitted.chars, 1, 
        { y: 0, opacity: 1 },
        { y: -50, opacity: 0, ease: ease.elastic }, 0.015, 0);

      TweenMax.set(to.container, { visibility: 'visible' });
      tl.staggerFromTo(to.splitted.chars, 1,
        { y: 50, opacity: 0, },
        { y: 0, opacity: 1, ease: ease.elastic }, 0.015, 0.15);

      tl.fromTo(from.label, 1,
        { y: this.parallax.y * titles.lp.y, opacity: 1 }, 
        { y: -40, opacity: 0, ease: ease.elastic }, 0);

      tl.fromTo(to, 1, 
        { lm: 50, hm: 40, }, 
        { lm: 0, hm: 0, ease: ease.elastic }, .25);

      tl.fromTo(to.label, .5, 
        { opacity: 0 }, { opacity: 1, ease: ease.default }, .25);

    }

    component.methods.enter = function () {

      let target = this.titles[this.current];
      let tl = target.timeline;
      
      TweenMax.set(target.container, { visibility: 'visible' });
      
      tl.staggerFromTo(target.splitted.chars, 1, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, ease: ease.elastic }, .015, .5);

      tl.fromTo(target, 1, 
        { lm: 50, hm: 40, },
        { lm: 0, hm: 0, ease: ease.elastic, }, .75);

      tl.fromTo(target.label, .5, 
        { opacity: 0, }, { opacity: 1, ease: ease.default }, .75);

    };


    // Animations
    
    component.methods.animate = function (f) {

      this.parallax.x += (this.mouse.orth.x - this.parallax.x) * .1;
      this.parallax.y += (this.mouse.orth.y - this.parallax.y) * .1;

      let t = this.titles[this.current];

      TweenMax.set(t.container, { 
        x: this.parallax.x * titles.p.x,
        y: this.parallax.y * titles.p.y 
      });

      TweenMax.set(t.label, {
        x: this.parallax.x * titles.lp.x,
        y: t.lm + this.parallax.y * titles.lp.y,
      });

      TweenMax.set(t.highlight, {
        x: this.parallax.x * titles.hp.x,
        y: t.hm + this.parallax.y * titles.hp.y
      });

    };



    /* Export */

    export default component;

  </script>


  <template lang="jade">
      
    .titles

      template(v-for="c in content")
        .title(ref="containers")
          h2.title-main(ref="titles") {{c.name}}
          span.title-label(ref="labels") 
            | {{c.type}}
            span(ref="highlight")

  </template>


  <style lang="stylus" scoped>
    
    .titles
      display block
      position absolute
      
    .title
      display block
      visibility hidden
      position absolute
      left 0
      top 0
      width 100%

    .title-main
      font-family Bodoni
      font-size 4em
      color rgba(#000, 0.8)
      letter-spacing 0.04em
      line-height 1
      font-smoothing always

    .title-label
      display inline-block
      position relative
      font-family "Gotham Bold"
      font-size 0.7em
      color #494729
      letter-spacing 0.1em
      text-transform uppercase
      margin 3em 0 0 4em

      span
        display block
        position absolute
        z-index -1
        top -11px
        left -12px
        bottom -8px
        right -12px
        background #f8e71c
        opacity 0.5

  </style>