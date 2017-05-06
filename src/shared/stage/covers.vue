<script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';

    import SVG from 'svg.js';

    import Projects from '../projects.json';

    import StageStore from './store.js';


    
    /* Component */

    var component = { 
      name: 'covers', 
      methods: {},
      mixins: []
    };


    // Properties
    
    component.props = {};

    component.data = function () {
      return {
        dimensions: {
          width: sw,
          height: sh
        },
        covers: StageStore.covers,
      };
    };


    component.components = {};


    // Hooks
    
    component.mounted = function () {

      $(window).on('resize', this.resize);

    };


    // Draw

    component.methods.resize = function () {

      this.dimensions.width = sw;
      this.dimensions.height = sh;

    };

    
    /* Export */

    export default component;

  </script>


  <template lang="jade">

    //- Root
    g.covers(x="0" y="0" width="100%" height="100%")
      
      //- Covers
      template(v-for="c in covers.items")
        image.cover(v-bind:xlink:href="c.url" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMinYMin slice" v-bind:class="{ active: c.active }" ref="covers")
      
      //- Default
      image.cover.cover-default(xlink:href="assets/images/projects/jaiye_cover.png" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMinYMin slice" v-bind:class="{ active: covers.default }" ref="default")

  </template>


  <style lang="stylus" scoped>
    
    .cover
      opacity 0

      &.active
        opacity 1

  </style>
  