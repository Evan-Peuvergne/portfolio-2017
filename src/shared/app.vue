

  <script>
    

    /* Dependencies */

    import $ from 'jquery';

    import Paper from 'paper';

    import Loader from './loader/loader.vue';
    import Stage from './stage/stage.vue';



    /* Component */

    var component = { name: 'app', methods: {} };

    component.data = function () {
      return {
        mouse: { 
          abs: { x: sw*.5, y: sh*.5 },
          orth: { x: .5, y: .5 }
        }
      }
    };

    component.components = { Loader, Stage };


    /* Hooks */

    component.created = function () {

      

    };

    component.mounted = function () {



    };



    /* Export */

    export default component;


  </script>


  <template lang="jade">
    
    //- Root
    .app

      //- Stage
      stage(v-bind:mouse="mouse" ref="stage")

      //- Loader
      loader(ref="loader")
  
      //- Content
      router-view(ref="view")

  </template>


  <style lang="stylus" src="./shared.styl"></style>
  
  <style lang="stylus" scoped>
    
    .stage
    .loader
      display block
      position absolute
      top 0
      left 0
      width 100%
      height 100%

    .stage
      z-index 1100

    .loader
      z-index 1000

  </style>