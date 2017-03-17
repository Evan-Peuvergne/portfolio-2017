

  <template lang="jade">
    
      background(v-bind:current="item")

  </template>


  <script>

    
    /* Dependencies */

    import $ from 'jquery';

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
      
      // Keyboard
      $(window).on('keydown', (e) => {
        switch(e.keyCode) {
          case 37: _.bind(component.methods.previous, this)(); break;
          case 39: _.bind(component.methods.next, this)(); break;
        }
      });

    }

    // Methods
    
    component.methods = {};
    
    component.methods.previous = function () { 

      let i = this.item-1; 
      this.item = (i >= 0) ? i : Projects.length-1;

    }  
    
    component.methods.next = function () { 
      
      this.item = (this.item+1)%Projects.length;

    }



    /* Export */

    export default component;

  </script>
  