

  <script>

    
    /* Dependencies */

    import $ from 'jquery';
    import { TimelineMax } from 'gsap';
    
    import Infos from './infos.vue';
    import Background from './background/background.vue';

    import Projects from './projects.json';


    
    /* Component */

    var component = { name: 'home' };


    // Properties
    
    component.data = function () {
      return {
        item: 0,
        content: Projects,
      }
    };

    component.components = {
      Infos,
      Background
    };


    // Init
    
    component.mounted = function () {

      // Properties
      this.is = { navigating: false, };
      
      // Keyboard
      $(window).on('keydown', (e) => {
        switch(e.keyCode) {
          case 37: _.bind(component.previous, this)(); break;
          case 39: _.bind(component.next, this)(); break;
        }
      });

    }

    // Navigation
    
    component.previous = function () { 

      if(this.is.navigating) { return; }
      this.is.navigating = true;
      setTimeout(() => { this.is.navigating = false; }, 1000);

      let i = this.item-1; 
      this.item = (i >= 0) ? i : Projects.length-1;

    }  
    
    component.next = function () { 

      if(this.is.navigating) { return; }
      this.is.navigating = true;
      setTimeout(() => { this.is.navigating = false; }, 1500);
      
      this.item = (this.item+1)%Projects.length;

    }



    /* Export */

    export default component;

  </script>


  <template lang="jade">
      
    .home
      infos(v-bind:current="item", v-bind:content="content")
      background(v-bind:current="item")

  </template>


  <style lang="stylus">
    
    .home
      position absolute
      top 0
      left 0
      width 100%
      height 100%

      .home-infos
      .home-background
        position absolute

      .home-infos
        z-index 200

      .home-background
        z-index 100

  </style>
  