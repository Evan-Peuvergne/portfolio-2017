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
        covers: StageStore.covers,
      };
    };


    component.components = {};


    // Hooks
    
    component.created = function () {

      

    };

    component.mounted = function () {

      // this.$refs.covers.forEach(c => { this.covers.push(SVG.adopt(c)); });
      // this.covers[0].style('display', 'block');

    };


    // Draw
    
    component.methods.draw = function () {

         

    };

    component.methods.resize = function () {

      

    };

    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    //- Root
    g.covers

      template(v-for="c in covers")
        image.cover(v-bind:xlink:href="c.url" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMinYMin slice" v-if="c.active" ref="covers")

  </template>


  <style lang="stylus" scoped>
    


  </style>
  