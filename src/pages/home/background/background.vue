


  <script>


    /* Dependencies */

    import _ from 'lodash';

    import Stage from './stage.js';

    import Projects from '../projects.json';


    
    /* Component */

    var component = { name: 'background', };


    // Properties
    
    component.props = {
      current: { type: Number, default: 0 }
    };

    component.data = function () {
      return { 
        length: Projects.length,
      };
    };

    component.watch = {
      current: function (val) {
        console.log('coucou');
      }
    }


    // Init

    component.mounted = function () {

      // Stage
      this.stage = new Stage({
        element: this.$el,
      });
      this.stage.init(Projects);

      // Launch
      this.stage.launch(this.current);

    };


    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    svg(width="100%", height="100%")

  </template>


  <style lang="stylus">
    
    svg
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%

  </style>
  