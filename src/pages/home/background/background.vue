


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
        console.log('coucou');
      }
    }


    // Init

    component.mounted = function () {

      // Letter
      this.letter = new Letter({
        element: $(this.$el).find('.background-letterCanvas').get(0),
      });
      this.letter.init(Projects);
      setTimeout(() => { this.letter.launch(this.current); }, 1000);

      this.tracker = new Tracker({
        element: $(this.$el).find('.background-trackerCanvas').get(0),
      });

      // $(window).on('keydown', _.bind(function (e) {
      //   switch(e.keyCode) {
      //     case 37: this.stage.previous(); break;
      //     case 39: this.stage.next(); break;
      //   }
      // }, this));
    };


    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    div.home-background
      canvas.background-letterCanvas
      canvas.background-trackerCanvas

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
  