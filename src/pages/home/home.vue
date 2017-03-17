

  <template lang="jade">
    
      background(v-bind:current="item")

  </template>


  <script>

    
    /* Dependencies */

    import $ from 'jquery';
    import { TimelineMax } from 'gsap';

    import Background from './background/background.vue';

    import Projects from './projects.json';


    
    /* Component */

    var component = { name: 'home' };


    // Properties
    
    component.data = function () {
      return {
        item: 0
      }
    };

    component.components = {
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
      setTimeout(() => { this.is.navigating = false; }, 1000);
      
      this.item = (this.item+1)%Projects.length;

    }



    /* Export */

    export default component;

  </script>
  