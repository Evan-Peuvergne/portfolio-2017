


  <script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';

    import { TweenMax } from 'gsap';

    import SVG from 'svg.js';

    import Projects from '../../pages/home/projects.json';


    
    /* Component */

    var component = { 
      name: 'background', 
      methods: {},
      mixins: []
    };


    // Properties
    
    component.props = {
      current: { type: Number, default: 0 },
    };

    component.data = function () {
      return {
        content: Projects
      };
    };

    component.watch = {
      current: function (val) {
        this.go(val);
        this.prev = val;
      }
    };


    component.components = { };


    // Hooks
    
    component.created = function () {

      this.prev = this.current;

      this.covers = [];

    };

    component.mounted = function () {

      // this.stage = new Paper.Project(this.$el);

      this.$refs.covers.forEach(c => { this.covers.push(SVG.adopt(c)); });
      this.covers[this.current].attr('display', 'block');
      // TweenMax.set(this.covers[this.current], { opacity: 1 });

    };


    // Draw
    
    component.methods.draw = function () {

      this.view.viewSize = new Paper.Size(sw, sh);

    };

    component.methods.resize = function () {



    };


    // Transition
    
    component.methods.go = function (index) {
      
      // TweenMax.set(this.covers[this.prev], { zIndex: -1 });
      // TweenMax.set(this.covers[index], { zIndex: 0, opacity: 0 });

      // let prev = this.prev;
      // TweenMax.fromTo(this.covers[index], .5, 
      //   { css: {opacity: 0 } }, 
      //   { css: { opacity: 1 }, ease: ease.default, 
      //   onComplete: () => { TweenMax.set(this.covers[prev], { opacity: 0 }); } 
      // });
      
      // TweenMax.set(this.covers[index], { opacity: 1 });
      // TweenMax.set(this.covers[this.prev], { opacity: 0 });
      
      this.covers[index].attr('display', 'block');
      this.covers[this.prev].attr('display', 'none');

    };

    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    g.background
      template(v-for="c in content")
        image.background-cover(v-bind:xlink:href="c.cover.url", x="0", y="0", width="100%", height="100%", preserveAspectRatio="xMinYMin slice", display="none", ref="covers")

  </template>


  <style lang="stylus" scoped>



  </style>
  