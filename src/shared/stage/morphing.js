

  
  /* Dependencies */

  import $ from 'jquery';
  import _ from 'lodash';

  import Paper from 'paper';


  

  /* Util */

  var Morphing = {};


  // Generate

  Morphing.generate = function (from, to, config) {

    let standard = { start: 0, end: 0 };
    config = _.extend({}, standard, config);

    var morphs = [];

    from = _.reverse(from.children);
    to = _.reverse(_.cloneDeep(to.children));

    let maxOffset = 0;

    from.forEach(f => {
      morphs.push({ from: f });
      if(f.segments.length > maxOffset){ maxOffset = f.segments.length; }
    });

    for(var i=0; i<to.length; i++){

      var flag = false;

      for(var j=0; j<morphs.length; j++){

        if(!morphs[j].from || morphs[j].to){ continue; }
        if(morphs[j].from.segments.length != to[i].segments.length){ continue; }

        flag = true;
        morphs[j].to = to[i];
        morphs[j].start = config.start;
        break;

      }

      if(!flag){ morphs.push({ to: to[i] }); }

    }

    morphs.forEach((m, i) => {

      if(!m.from){ m.from = Morphing._emptyPath(m.to); }
      if(!m.to){ m.to = Morphing._emptyPath(m.from); }

      m.start = config.start;
      // m.offset = maxOffset - Math.max(m.from.segments.length, m.to.segments.length);
      m.offset = 0;

    });

    return morphs;

  };

  Morphing._emptyPath = function (path) {

    let empty = _.cloneDeep(path);
    let c = path.bounds.center;

    empty.segments.forEach(s => {
      s.point.ox = c.x; s.point.oy = c.y;
      [s.handleIn, s.handleOut].forEach(p => { p.ox = 0; p.oy = 0; });
    });

    return empty;

  };


  // Run

  Morphing.run = function (timeline, shape, morphs, config) {

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
          { ox: t.point.ox, oy: t.point.oy, ease: ease.elasoft, delay: 0 }, 
          i*config.step);
        timeline.to(s.handleIn, config.duration, 
          { ox: t.handleIn.ox, oy: t.handleIn.oy, ease: ease.elasoft, delay: 0 }, 
          i*config.step);
        timeline.to(s.handleOut, config.duration, 
          { ox: t.handleOut.ox, oy: t.handleOut.oy, ease: ease.elasoft, delay: 0 }, 
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


  