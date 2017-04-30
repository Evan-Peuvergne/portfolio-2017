

  
  /* Dependencies */

  import $ from 'jquery';
  import _ from 'lodash';

  import Paper from 'paper';


  

  /* Util */

  var Morphing = {};


  // Generate
  
  Morphing.generate = function (from, to, config = {}) {

    let standard = { start: 0, end: 0 };
    config = _.extend({}, standard, config);

    var morphs = [];

    from = _.reverse(from.children);
    to = _.reverse(_.cloneDeep(to.children));

    let commons = Math.min(from.length, to.length);
    let diffs = Math.max(from.length, to.length);

    for(var i=0; i<commons; i++) { 
      morphs.push({ 
        from: from[i], to: to[i], 
        start: config.start }); 
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


  // Run
  
  Morphing.run = function (timeline, shape, morphs, config = {}) {

    let standard = { duration: .75, step: .005 };
    config = _.extend({}, standard, config);

    timeline.clear();

    shape.children = [];
    morphs.forEach(m => { shape.children.push(m.from); });

    morphs.forEach((m, j) => {
      for(var i=0; i<m.from.segments.length; i++){

        let c = (i+m.start)%m.from.segments.length;
        let s = m.from.segments[c];
        let t = m.to.segments[i];

        timeline.to(s.point, config.duration, 
          { ox: t.point.ox, oy: t.point.oy, ease: ease.elastic, delay: 0 }, 
          i*config.step);
        timeline.to(s.handleIn, config.duration, 
          { ox: t.handleIn.ox, oy: t.handleIn.oy, ease: ease.elastic, delay: 0 }, 
          i*config.step);
        timeline.to(s.handleOut, config.duration, 
          { ox: t.handleOut.ox, oy: t.handleOut.oy, ease: ease.elastic, delay: 0 }, 
          i*config.step);

      }
    });

  };


  // Clear
  
  Morphing.clear = function (shape, model) {

    let toDelete = shape.children.length - model.children.length;
    if(toDelete < 1){ return; }

    shape.children = shape.children.slice(toDelete);

  };



  /* Export */

  export default Morphing;