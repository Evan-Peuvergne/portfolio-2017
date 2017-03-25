


  <script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';
    import { TweenMax } from 'gsap';

    import Paper from 'paper';

    import Mixins from './mixins.js';

    import S from '../../../shared/helpers/sizes.js';
    import Ticker from '../../../shared/helpers/ticker.js';



    
    /* Component */

    var component = { name: 'tracker', methods: {} };


    // Mixins
    
    component.mixins = [ Mixins.Covers, Mixins.Distorsion ];


    // Properties
    
    component.props = {
      current: { type: Number, default: 0 },
      content: { type: Array, default: [] },
      mouse: { type: Object },
    };

    component.data = function () {
      return { 
        length: this.content.length,
      };
    };

    component.watch = {
      current: function (val) {
        this.go(val);
        this.prev = val;
      }
    }


    // Init

    component.mounted = function () {

      this.shape = new Paper.CompoundPath();
      this.shape.fillColor = '#000';
      this.container.insertChild(0, this.shape);
      this.container.clipped = true;

      this.models = [];
      _.each(this.content, (c, i) => {
        let model = new Paper.CompoundPath(c.letter.path);
        model.fitBounds(new Paper.Rectangle({
          point: [ 0, sh*(1-c.letter.size)/2 ], size: [ sw, sh*c.letter.size ] 
        }));
        model.position.x = sw*.5 - model.bounds.width*(1-c.letter.offset.x) - 25;
        model.position.y = sh*.5 - model.bounds.height*c.letter.offset.y;  
        this.models.push(model);
      });

      this.launch();

    };


    // Launch
    
    component.methods.launch = function () {

      this.prev = this.current;

      this.shape.children = _.cloneDeep(this.models[0].children);
      this.covers[0].opacity = 1;

    };


    // Go
    
    component.methods.go = function (i) {

      

    };


    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    canvas.background-letter

  </template>


  <style lang="stylus" scoped>

    

  </style>
  