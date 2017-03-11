


  <script>


    /* Dependencies */

    import _ from 'lodash';
    import SVG from 'svg.js';

    import { TweenMax } from 'gsap';
    import Morph from '../../shared/libs/MorphSVGPlugin.js';

    import S from '../../shared/helpers/sizes.js';

    import Projects from './projects.json';


    
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
        
      }
    }


    // Init

    component.mounted = function () {

      // Stage
      this.stage = SVG(this.$el);
      this.stage.size(window.innerWidth, window.innerHeight);

      // Letters
      this.letters = [];

      _.each(Projects, _.bind(function (p, i) 
      {
        var letter = this.stage.path(p.letter.path);
        this.stage.defs().put(letter);
        letter.size(null, S.window.h*p.letter.size);
        letter.x(S.window.w*0.5 - letter.width()*(1-p.letter.offset.x) - 25);
        letter.y(S.window.h*0.5 - letter.height()*(0.5-p.letter.offset.y));
        this.letters.push(letter);
      }, this));

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
  