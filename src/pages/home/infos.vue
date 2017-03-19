

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

    component.components = {};


    // Init
    
    component.mounted = function () {

      this.projects = [];
      this.$refs.infos.forEach((e, i) => {
        var dom = { elem: this.$refs.infos[i], title: this.$refs.titles[i], 
          splitted: null, label: this.$refs.labels[i] };
        this.projects.push(dom, i);
        this.initProject(dom);
      });

      this.mouse = { x: 0, y: 0 };
      $(window).on('mousemove', (e) => {
        this.mouse.x = e.clientX/S.window.w - .5;
        this.mouse.y = e.clientY/S.window.h - .5;
      });

      new Ticker().tick('parallax', (t) => {
        this._parallax(t);
      });

    };

    component.methods.initProject = function (p, i){

      p.title.innerHTML = p.title.innerHTML.replace(' ', '<br/>');
      p.label.innerHTML += '<span></span>';
      p.labelBackground = p.label.getElementsByTagName('span')[0];
      p.labelBackground.position = { x: 0, y: 0 };

      p.splitted = new Splitter(p.title, { type: 'lines,chars' });
      TweenMax.set(_.last(p.splitted.lines), { x: 20 });

      _.each(p.splitted.chars, (c, j) => {
        c.target = { amplitude: _.random(5,10), 
                direction: (j%2 == 0) ? 1 : -1, };
        c.position =  { x: 0, y: 0, };
        c.rotation = 0;
      });

      p.label.position = { x: 0, y: 0 };

    };


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

        c.position.x += (positionX - c.position.x)*0.1;
        c.position.y += (positionY - c.position.y)*0.1;
        c.rotation += (rotation - c.rotation)*0.1;
        TweenMax.set(c, { css: { rotation: c.rotation, x: c.position.x, y: c.position.y, } });
      });

      var ratio = 30;
      project.label.position.x += (x*ratio - project.label.position.x)*0.1;
      project.label.position.y += (y*ratio - project.label.position.y)*0.1;
      TweenMax.set(project.label, { x: -project.label.position.x, y: -project.label.position.y });

      var ratio = 10;
      project.labelBackground.position.x += (x*ratio - project.labelBackground.position.x)*0.1;
      project.labelBackground.position.y += (y*ratio - project.labelBackground.position.y)*0.1;
      TweenMax.set(project.labelBackground, { x: -project.labelBackground.position.x, y: -project.labelBackground.position.y });

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
      display none
      position absolute
      top 0
      left 0
      width 300px

      &:first-child
        display block

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