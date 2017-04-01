


	/* Dependencies */


	// Libs
	
	import _ from 'lodash';
	import Paper from 'paper';
	import { TweenMax } from 'gsap';


	// Modules
	
	import Ticker from '../../../shared/helpers/ticker.js';


	// Config
	
	import Projects from '../projects.json';





	/* Mixins */


	// Objects
	
	var Covers = { methods: {} };
	var Letter = { methods: {} };
	var Distorsion = { methods: {} };

	var Mixins = { Covers: Covers,  Letter: Letter, Distorsion: Distorsion };


	// Export 
	
	export default Mixins;





	/* Covers */


	// Init
	
	Covers.created = function () {

		this.prev = 0;
		this.content = Projects;

	};
	
	Covers.mounted = function () {

		this.stage = new Paper.Project(this.$refs.canvas);
		this.stage.view.viewSize = new Paper.Size(sw, sh);
		this.view = this.stage.view;
    	// this.view.autoUpdate = false;

		this.container = new Paper.Group();

		this.covers = [];
		_.each(this.content, (c, i) => {
			let cover = new Paper.Raster({
				source: c.cover.url,
				position: new Paper.Point(sw*.5, sh*.5),
				opacity: (i == this.current) ? 1 : 0
			});
			cover.onLoad = function () {
				this.ratio = Math.max(sw/this.size.width, sh/this.size.height);
        this.size = new Paper.Size(this.size.width*this.ratio, this.size.height*this.ratio);
			};

			this.container.addChild(cover);
			this.covers.push(cover);
		});

	};


	// Transition
	
	Covers.methods._coversTransition = function (index) {

		TweenMax.to(this.covers[this.prev], .75, { opacity: 0, ease: ease.default });
    TweenMax.to(this.covers[index], .75, { opacity: 1, ease: ease.default });

	};




	/* Letter */


  // Hooks
  
  Letter.created = function () {

    this.parallax = { x: 0, y: 0 };

  };


	// Morph
	
	Letter.methods._morph = function (i) {

    let morphs = this._createMorphs(this.shape.children, this.models[i].children);
    this.shape.children = [];
    _.each(morphs, (m) => { this.shape.children.push(m.from); });
    
    let tl = new TimelineMax({
      onComplete: () => {
        let toDelete = this.shape.children.length - this.models[i].children.length;
        if(toDelete < 1){ return; }
        this.shape.children = this.shape.children.slice(toDelete);
        this.view.update();
      }
    });

    _.each(morphs, (m, j) => {
      for(var i=0; i<m.from.segments.length; i++){
        let c = (i+m.start)%m.from.segments.length;
        let s = m.from.segments[c], t = m.to.segments[c];
        tl.to(s.point, .75, { ox: t.point.ox, oy: t.point.oy, ease: ease.elastic, delay: 0 }, i*.005);
        tl.to(s.handleIn, .75, { ox: t.handleIn.ox, oy: t.handleIn.oy, ease: ease.elastic, delay: 0 }, i*.005);
        tl.to(s.handleOut, .75, { ox: t.handleOut.ox, oy: t.handleOut.oy, ease: ease.elastic, delay: 0 }, i*.005);
      }
    });

  };

  Letter.methods._createMorphs = function (from, to) {

    var morphs = [];

    from = _.reverse(from);
    to = _.reverse(_.cloneDeep(to));

    let commons = Math.min(from.length, to.length);
    let diffs = Math.max(from.length, to.length);

    for(var i=0; i<commons; i++) { 
      morphs.push({ 
        from: from[i], to: to[i], 
        start: this.content[this.current].letter.transition.origin }); 
    }
    if(diffs < 1){ return morphs; }

    let supp = (from.length > to.length) ? from : to;
    for(let j=commons; j<(commons+diffs)-1; j++) {
      let m = { from: _.cloneDeep(supp[j]), to: _.cloneDeep(supp[j]), start: 0 };
      morphs.unshift(m);
      
      let toClear = (from.length > to.length) ? m.to : m.from;
      let center = { 
        x: toClear.bounds.x+toClear.bounds.width/2,
        y: toClear.bounds.y+toClear.bounds.height/2 };

      _.each(toClear.segments, (s) => {
        s.point.ox = center.x; s.point.oy = center.y;
        s.handleIn.ox = 0; s.handleIn.oy = 0;
        s.handleOut.ox = 0; s.handleOut.oy = 0;
      });
    }

    return morphs;

  };


  // Bounds
  
  Letter.methods._calculateBounds = function (i) {

  	let shape = this.models[i];
  	let center = shape.bounds.center;

  	let width = shape.bounds.width + tracker.s + tracker.p*2 + 40;
  	let height = shape.bounds.height + tracker.s + tracker.p*2 + 40;
  	let x = center.x - width*.5;
  	let y = center.y - height*.5;  	

  	return new Paper.Rectangle(x, y, width, height);

  };




	/* Distorsion */


	// Animation
	
	Distorsion.methods._distord = function (f, settings) {

		var items = [];
		if(this.shape.children){ items = this.shape.children; }
		else{ items[0] = this.shape; }

		_.each(items, (c) => {
			_.each(c.segments, (s, i) => {
				s.point.x += Math.cos(f.count*settings.f + i*2) * settings.a;
				s.point.y += -Math.sin(f.count*settings.f + i*i) * settings.a;
			});
		});

	};
	
