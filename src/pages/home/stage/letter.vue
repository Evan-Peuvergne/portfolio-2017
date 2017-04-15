


  <script>


    /* Dependencies */

    import $ from 'jquery';
    import _ from 'lodash';

    import SVG from 'svg.js';
    import Paper from 'paper';

    import Ticker from '../../../shared/helpers/ticker.js';

    import Projects from '../projects.json';


    
    /* Component */

    var component = { 
      name: 'letter', 
      methods: {},
      mixins: []
    };


    // Properties
    
    component.props = {
      current: { type: Number, default: 0 },
      mouse: { type: Object },
      shape: { type: Object },
      models: { type: Array }
    };

    component.data = function () {
      return {};
    };

    component.watch = {
      current: function (val) {
        this.go(val);
        this.prev = val;
      }
    };

    component.components = {};


    // Hooks
    
    component.created = function () {

      this.parallax = { x: 0, y: 0 };

      this.tl = new TimelineMax({
        onComplete: () => { this.clear(this.current); }
      });

    };

    component.mounted = function () {

      this.letter = SVG.adopt(this.$el);

      new Ticker().tick('letter.animation', this.animate);

    };


    // Draw
    
    component.methods.draw = function () {



    };

    component.methods.resize = function () {



    };


    // Animate
    
    component.methods.animate = function (f) {

      this.parallax.x += (this.mouse.orth.x*tracker.p - this.parallax.x) * .1;
      this.parallax.y += (this.mouse.orth.y*tracker.p - this.parallax.y) * .1;

      let distorsion = Projects[this.current].letter.distorsion;

      this.shape.children.forEach(c => {
        c.segments.forEach((s, i) => {
          
          s.point.x = s.point.ox + this.parallax.x + Math.cos(f.time*distorsion.frequency + i) * distorsion.amplitude;
          s.point.y = s.point.oy + this.parallax.y - Math.sin(f.time*distorsion.frequency + i) * distorsion.amplitude;
          
          [s.handleIn, s.handleOut].forEach(p => { 
            p.x = p.ox;
            p.y = p.oy;
          });
          
        });
      });

      this.letter.attr('d', this.shape.pathData);

    };


    // Transition

    component.methods.go = function (i) {

      this.tl.clear();
      if(this.prev != null){ this.clear(this.prev); }

      let morphs = this.morphs(this.shape.children, this.models[i].children);
      this.shape.children = [];
      morphs.forEach(m => { this.shape.children.push(m.from) });

      morphs.forEach((m, j) => {
        for(var i=0; i<m.from.segments.length; i++){
          let c = (i+m.start)%m.from.segments.length;
          let s = m.from.segments[c], t = m.to.segments[c];
          this.tl.to(s.point, .75, { ox: t.point.ox, oy: t.point.oy, ease: ease.elastic, delay: 0 }, i*.005);
          this.tl.to(s.handleIn, .75, { ox: t.handleIn.ox, oy: t.handleIn.oy, ease: ease.elastic, delay: 0 }, i*.005);
          this.tl.to(s.handleOut, .75, { ox: t.handleOut.ox, oy: t.handleOut.oy, ease: ease.elastic, delay: 0 }, i*.005);
        }
      });

    };

    component.methods.morphs = function (from, to) {

      var morphs = [];

      from = _.reverse(from);
      to = _.reverse(_.cloneDeep(to));

      let commons = Math.min(from.length, to.length);
      let diffs = Math.max(from.length, to.length);

      for(var i=0; i<commons; i++) { 
        morphs.push({ 
          from: from[i], to: to[i], 
          start: Projects[this.current].letter.transition.origin }); 
      }
      if(diffs < 1){ return morphs; }

      let supp = (from.length > to.length) ? from : to;
      for(let j=commons; j<(commons+diffs)-1; j++) {
        let m = { from: _.cloneDeep(supp[j]), to: _.cloneDeep(supp[j]), start: 0 };
        morphs.unshift(m);
        
        let toClear = (from.length > to.length) ? m.to : m.from;
        let center = toClear.bounds.center;

        _.each(toClear.segments, (s) => {
          s.point.ox = center.x; s.point.oy = center.y;
          s.handleIn.ox = 0; s.handleIn.oy = 0;
          s.handleOut.ox = 0; s.handleOut.oy = 0;
        });
      }

      return morphs;

    };

    component.methods.clear = function (i) {

      let toDelete = this.shape.children.length - this.models[i].children.length;
      if(toDelete < 1){ return; }

      this.shape.children = this.shape.children.slice(toDelete);

    };

    
    /* Export */

    export default component;

  </script>


  <template lang="jade">
    
    path.home-stageLetter

  </template>


  <style lang="stylus">

    .home-stageLetter
      stroke-width 0

  </style>
  