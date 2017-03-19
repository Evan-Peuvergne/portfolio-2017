

  <script>

    
    /* Dependencies */

    import $ from 'jquery';
    import { TimelineMax } from 'gsap';

    import Splitter from '../../shared/libs/SplitText.js';

    import S from '../../shared/helpers/sizes.js';
    import Ticker from '../../shared/helpers/ticker.js';



    
    /* Component */

    var component = { name: 'infos', methods: {} };


    // Properties
    
    component.props = {
      current: { type: Number, default: 0 },
      content: { type: Array, default: [] },
    };
    
    component.data = function () {
      return {}
    };

    component.watch = {
      current: function (val) {
        this.go(val);
      }
    }


    // Init
    
    component.mounted = function () {

      this.prev = this.current;
      this._isMoving = false;

      this.projects = [];
      this.$refs.infos.forEach((e, i) => {
        var dom = { elem: this.$refs.infos[i], title: this.$refs.titles[i], 
          splitted: null, label: this.$refs.labels[i], labelBackground: null, };
        this.projects.push(dom);
        this.initProject(dom);
      });
      this.projects[this.current].elem.style.visibility = 'visible';

      this.mouse = { x: 0, y: 0 };
      $(window).on('mousemove', (e) => {
        this.mouse.x = e.clientX/S.window.w - .5;
        this.mouse.y = e.clientY/S.window.h - .5;
      });

      new Ticker().tick('parallax', (t) => {
        if(!this._isMoving){ this._parallax(t); }
      });

    };

    component.methods.initProject = function (p, i){

      p.elem.style.visibility = 'hidden';

      p.title.innerHTML = p.title.innerHTML.replace(' ', '<br/>');
      p.label.innerHTML += '<span></span>';
      p.labelBackground = p.label.getElementsByTagName('span')[0];
      p.labelBackground.position = { x: 0, y: 0 };

      p.splitted = new Splitter(p.title, { type: 'lines,chars' });
      TweenMax.set(_.last(p.splitted.lines), { x: 20 });

      _.each(p.splitted.chars, (c, j) => {
        c.target = { amplitude: _.random(5,10), direction: (j%2 == 0) ? 1 : -1, };
        c.p =  { x: 0, y: 0, };
        c.r = 0;
      });

      p.label.p = { x: 0, y: 0 };
      p.labelBackground.p = { x: 0, y: 0 };

    };


    // Transition
    
    component.methods.go = function (index) {

      this._isMoving = true;

      let from = this.projects[this.prev];
      let to = this.projects[this.current];

      let tl = new TimelineMax({ onComplete: () => { 
        this._isMoving = false;
        from.elem.style.visibility = 'hidden'; 
      } });
      to.elem.style.visibility = 'visible';
    
      var ease = Elastic.easeOut.config(1, .8);
      var duration = 1;
      tl.staggerFromTo(from.splitted.chars, duration, 
        { y: 0, opacity: 1 },
        { y: -50, opacity: 0, ease: ease }, 0.01, 0);
      tl.staggerFromTo(to.splitted.chars, duration, 
        { y: 50, opacity: 0, },
        { y: 0, opacity: 1, ease: ease, }, 0.01, 0.15);

      tl.fromTo(from.label, 1, { y: 0, opacity: 1 }, { y: -50, opacity: 0, ease: ease }, .15);
      tl.fromTo(to.label, 1, { y: 50, opacity: 0 }, { y: 0, opacity: 1, ease: ease }, .3);      

      tl.fromTo(from.labelBackground, 1, { y: 0, opacity: 0.5 }, { y: -25, opacity: 0, ease: ease }, 0.20);
      tl.fromTo(to.labelBackground, 1, { y: 25, opacity: 0 }, { y: 0, opacity: 0.5, ease: ease }, 0.35);

      this.prev = this.current;

    }


    // Animations
    
    component.methods._parallax = function (t) {

      let project = this.projects[this.current];

      let x = this.mouse.x;
      let y = this.mouse.y;

      _.each(project.splitted.chars, (c, i) => {
        var ratio = 20;
        var positionX = this.mouse.x*ratio;
        var positionX = -(x*ratio + (2*(x*y)*c.target.amplitude*c.target.direction*0.1));
        var positionY = -(y*ratio + (2*(x*y)*c.target.amplitude*c.target.direction));
        var rotation = 2*x*y*c.target.amplitude*c.target.direction;

        c.p.x += (positionX - c.p.x)*0.1;
        c.p.y += (positionY - c.p.y)*0.1;
        c.r += (rotation - c.r)*0.1;
        TweenMax.set(c, { css: { rotation: c.r, x: c.p.x, y: c.p.y, } });
      });

      var ratio = 30;
      project.label.p.x += (x*ratio - project.label.p.x)*0.1;
      project.label.p.y += (y*ratio - project.label.p.y)*0.1;
      TweenMax.set(project.label, { x: -project.label.p.x, y: -project.label.p.y });

      var ratio = 10;
      project.labelBackground.p.x += (x*ratio - project.labelBackground.p.x)*0.1;
      project.labelBackground.p.y += (y*ratio - project.labelBackground.p.y)*0.1;
      TweenMax.set(project.labelBackground, { x: -project.labelBackground.p.x, y: -project.labelBackground.p.y });

    };



    /* Export */

    export default component;

  </script>


  <template lang="jade">
      
    .home-infos
      .home-info(v-for="c in content", ref="infos")
        h2.home-infoTitle(ref="titles") {{c.name}}
        span.home-infoLabel(ref="labels") {{c.type}}

  </template>


  <style lang="stylus">
    
    .home-infos
      position absolute
      top 50%
      left 50%
      margin-left 25px
      margin-top -25px

    .home-info
      display block
      position absolute
      top 0
      left 0
      width 300px

      .home-infoTitle
        font-family Bodoni
        font-size 60px
        letter-spacing 0.04em
        line-height 1.1

      .home-infoLabel
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
          background-color #f8e71c
          opacity 0.5

  </style>