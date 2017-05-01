

  <script>
    

    /* Dependencies */

    import $ from 'jquery';

    import Paper from 'paper';

    import Loader from './loader/loader.vue';
    import Stage from './stage/stage.vue';



    
    /* Component */

    var component = { name: 'app', methods: {} };

    component.data = function () {
      return {};
    };

    component.computed = {
      title: function () {
        return this.$refs.view.title || 'Evan Peuvergne | Webdesigner & Developer';
      }
    };

    component.components = { Loader, Stage };


    

    /* Hooks */

    component.created = function () {

      this.$favicon = document.querySelector("link[rel*='icon']");      

    };

    component.mounted = function () {

      $(window).on('focus', () => {
        this.$favicon.href="./assets/favicon/here.ico";
        document.title = this.title;
        console.log(this.title);
      });

      $(window).on('blur', () => { 
        this.$favicon.href="./assets/favicon/leaving.ico";
        document.title = 'Don\'t leave pleaseeeee'; 
        console.log(this.title);
      });

    };




    /* Methods */


    // Metas
    
    component.methods.setTitle = function (t) {

      console.log("tata");

    };





    /* Export */

    export default component;


  </script>


  <template lang="jade">
    
    //- Root
    .app

      //- Stage
      stage(ref="stage")

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