


  <script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';

    import Paper from 'paper';

    import { TweenMax } from 'gsap';

    import Projects from '../projects.json';


    
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

      this.covers = this.$refs.covers;
      TweenMax.set(this.covers[this.current], { opacity: 1 });

    };


    // Draw
    
    component.methods.draw = function () {

      this.view.viewSize = new Paper.Size(sw, sh);

    };

    component.methods.resize = function () {



    };


    // Transition
    
    component.methods.go = function (index) {
      
      TweenMax.set(this.covers[this.prev], { zIndex: -1 });
      TweenMax.set(this.covers[index], { zIndex: 0, opacity: 0 });

      let prev = this.prev;
      TweenMax.fromTo(this.covers[index], .5, 
        { css: {opacity: 0 } }, 
        { css: { opacity: 1 }, ease: ease.default, 
        onComplete: () => { TweenMax.set(this.covers[prev], { opacity: 0 }); } 
      });

    };

    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    .background
      template(v-for="c in content")
        .background-cover(v-bind:style="{ backgroundImage: 'url(' + c.cover.url + ')' }", ref="covers")

  </template>


  <style lang="stylus" scoped>

    .background
    .background-cover
      position absolute
      width 100%
      height 100%

    .background-cover
      z-index -1
      opacity 0
      background-size cover

  </style>
  