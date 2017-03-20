


  <script>


    /* Dependencies */

    import $ from 'jquery';
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
        this.stage.go(val);
      }
    }


    // Init

    component.mounted = function () {

      // Stage
      this.stage = new Stage({
        canvasLetter: $(this.$el).find('.background-letterCanvas').get(0),
        canvasTracker: $(this.$el).find('.background-trackerCanvas').get(0),
        canvasShade: $(this.$el).find('.background-shadeCanvas').get(0),
      });
      this.stage.init(Projects);
      this.stage.launch(this.current);



    };


    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    div.home-background
      
      div.background-organic
        canvas.background-letterCanvas
        canvas.background-trackerCanvas

      canvas.background-shadeCanvas

      svg(width="100%", height="100%")
        defs
          filter(id="organic")
            feGaussianBlur(in="SourceGraphic" stdDeviation="8" result="blur")
            feColorMatrix(in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo")
            feComposite(in="SourceGraphic" in2="goo" operator="atop")

  </template>


  <style lang="stylus">

    .home-background
      position relative
      width 100%
      height 100%
    
    canvas
      display block
      position absolute
      top: 0 
      left 0
      bottom 0
      right 0

    .background-organic
      position absolute
      top 0
      left 0
      z-index 100
      filter: url(#organic)

    .background-shadeCanvas
      z-index 50

  </style>
  