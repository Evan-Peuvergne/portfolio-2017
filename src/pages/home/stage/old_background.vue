


  <script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';
    import Paper from 'paper';

    import Letter from './letter.vue';
    import Tracker from './tracker.vue';
    import Shade from './shade.vue';
    import Navigation from './navigation.vue';
    
    import Mixins from './mixins';

    import Ticker from '../../../shared/helpers/ticker.js';

    import Projects from '../projects.json';


    
    /* Component */

    var component = { 
      name: 'background', 
      methods: {},
      mixins: []
    };


    // Properties
    
    component.props = {
      current: { type: Number, default: 0 },
      content: { type: Array, default: [] },
      mouse: { type: Object },
    };

    component.data = function () {
      return { 
        bounds: new Paper.Rectangle({
          point: [0, 0], size: [sw, sh] }),
        length: this.content.length,
        organic: sh/140,
        // organic: sh/110,
        // organic: sh/90
      };
    };

    component.watch = {
      current: function (val) {
        this.prev = val;
      }
    };


    component.components = { 
      Letter, Tracker, Shade, Navigation
    };


    // Init

    component.mounted = function () {

      console.log(document.width);

      this.locations = [this.$refs.previous, this.$refs.next];
      this.bounds = this.$refs.letter.bounds;
      this.currentLocation = this.$refs.letter.$refs.container;
      this.$refs.letter.$refs.container.append(this.$refs.tracker.$el);

      // $(window).on('mousemove', () => { this.transfer(); });

    };


    // Transfer
    
    component.methods.transfer = function () {

      let t = new Paper.Rectangle({
        point: [ this.mouse.abs.x, this.mouse.abs.y ],
        size: [0, 0]
      }).expand(tracker.d);

      for(var i=0; i<this.locations.length; i++) {

        let loc = this.locations[i];
        let bounds = loc.bounds;
        if(bounds.intersects(t)){
          if(loc != this.currentLocation){ 
            loc.$refs.container.appendChild(this.$refs.tracker.$el);
            this.bounds = bounds;
            this.currentLocation = loc;
          }
          return;
        }

      }

      if(this.currentLocation != this.$refs.letter.$refs.container){
        this.$refs.letter.$refs.container.appendChild(this.$refs.tracker.$el);
        this.bounds = this.$refs.letter.bounds;
        this.currentLocation = this.$refs.letter.$refs.container;
        return;
      }

      return;

    };


    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    div.home-background
  
      //- Navigation
      navigation(direction="previous", v-bind:current="current", v-bind:mouse="mouse", v-bind:content="content", ref="previous")
      navigation(direction="next", v-bind:current="current", v-bind:mouse="mouse", v-bind:content="content" ref="next")
      
      //- Tracker
      tracker(v-bind:bounds="bounds", v-bind:current="current", v-bind:content="content", v-bind:mouse="mouse", ref="tracker")
      
      //- Letter
      letter(v-bind:current="current", v-bind:content="content", v-bind:mouse="mouse", ref="letter")
      shade(v-bind:current="current", v-bind:content="content", v-bind:mouse="mouse", ref="shade")

      //- Filters
      svg(width="100%", height="100%")
        defs
          filter(id="organic")
            feGaussianBlur(in="SourceGraphic" v-bind:stdDeviation="organic" result="blur")
            feColorMatrix(in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo")
            feComposite(in="SourceGraphic" in2="goo" operator="over")

          filter(id="shadow")
            feOffset(dx="0", dy="0", result="offset", in="SourceGraphic")
            feGaussianBlur(stdDeviation="20", result="blur", in="offset")
            feComponentTransfer
              feFuncA(type="linear", slope="0.6")
            feMerge
              feMergeNode
              feMergeNode(in="SourceGraphic")


  </template>


  <style lang="stylus">

    .home-background
      position relative
      width 100%
      height 100%
      /*filter url(#shadow)*/

    .background-shadeCanvas
      z-index 50

    .background-letter
      position absolute
      z-index 200
      /*filter url(#organic)*/

    .background-letterCanvas
      position absolute
      top 0
      left 0
      width 100%
      height 100%

  </style>
  