


  <script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';

    import Letter from './letter.js';
    import Tracker from './tracker.js';

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
        this.letter.go(val);
      }
    }


    // Init

    component.mounted = function () {

      // Letter
      this.letter = new Letter({
        canvasLetter: $(this.$el).find('.background-letterCanvas').get(0),
        canvasShade: $(this.$el).find('.background-shadeCanvas').get(0),
      });
      this.letter.init(Projects);
      this.letter.launch(this.current);

      this.tracker = new Tracker({
        element: $(this.$el).find('.background-trackerCanvas').get(0),
      });
    };


    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    div.home-background
      canvas.background-letterCanvas
      canvas.background-trackerCanvas
      canvas.background-shadeCanvas

  </template>


  <style lang="stylus">
    
    canvas
      display block
      position absolute
      top: 0 
      left 0
      bottom 0
      right 0
      // background red

  </style>
  