


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

      console.log($('.background-letterCanvas'));

      // Letter
      this.letter = new Letter({
        canvasLetter: $(this.$el).find('.background-letterCanvas').get(0),
        canvasTracker: $(this.$el).find('.background-trackerCanvas').get(0),
        canvasShade: $(this.$el).find('.background-shadeCanvas').get(0),
      });
      this.letter.init(Projects);
      this.letter.launch(this.current);
    };


    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    div.home-background

      svg(width="100%", height="100%")
        defs
          filter(id="old-goo")
            feGaussianBlur(in="SourceGraphic" stdDeviation="10" result="blur")
            feColorMatrix(in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo")
            feBlend(in="SourceGraphic" in2="goo")
          filter(id="fancy-goo")
            feGaussianBlur(in="SourceGraphic" stdDeviation="4" result="blur")
            feColorMatrix(in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo")
            feComposite(in="SourceGraphic" in2="goo" operator="atop")
      
      div.background-gooey
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

    .background-letterCanvas
      z-index 100

    .background-trackerCanvas
      z-index 110;

    .background-shadeCanvas
      z-index 10;

    .background-gooey
      filter url("#fancy-goo")

  </style>
  