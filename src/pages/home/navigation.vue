

  <script>

    
    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';

    import Paper from 'paper';
    import { TimelineMax } from 'gsap';
    import Ticker from '../../vendors/helpers/ticker.js';

    import Projects from './projects.json';


    
    /* Component */

    var component = { name: 'navigation', methods: {} };


    // Properties
    
    component.props = {
      mouse: { type: Object },
      current: { type: Number }
    };
    
    component.data = function () {
      return {
        projects: Projects,
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

      

    };


    // Draw
    
    component.methods.draw = function () {

      

    };

    component.methods.resize = function (e) {

      

    };



    /* Export */

    export default component;
    

  </script>


  <template lang="jade">
    
    //- Root
    .navigation

      //- Arrows
      a.navigation-arrow.navigation-previous
        img(src="assets/icons/previous.svg")

      a.navigation-arrow.navigation-next
        img(src="assets/icons/next.svg")

      //- Access
      a.navigation-access(v-bind:href="url" target="_blank") Click <strong v-bind:style="{ color: color }">here</strong> to discover project

  </template>


  <style lang="stylus" scoped>

    .navigation-arrow
      display block
      position absolute
      top 50%
      width 1em

      &.navigation-previous
        left 3.2em

      &.navigation-next
        right 3.2em

      img
        display block
        width 100%
        opacity 0.2

    .navigation-access
      display block
      position absolute
      left 50%
      bottom 1em
      padding 2em
      font-family Gotham Bold
      font-size 0.8em
      color rgba(#000, 0.3)
      letter-spacing 0.1em
      text-transform uppercase
      text-align center
      text-decoration none
      cursor pointer
      transform translate3d(-50%, 0, 0)

      strong
        color #ff6631
        padding 3em
        margin -3em
        transition color 0.3s ease

        &:hover
          color rgba(#fefefe, 0.85) !important

  </style>
  