


	/* Dependencies */


	// Libs
	
	import _ from 'lodash';
	import Paper from 'paper';


	// Modules
	
	import Ticker from '../../../shared/helpers/ticker.js';


	// Config
	
	import Projects from '../projects.json';





	/* Mixins */


	// Objects
	
	var Covers = { methods: {} };
	var Distorsion = { methods: {} };

	var Mixins = { Covers: Covers, Distorsion: Distorsion };


	// Export 
	
	export default Mixins;





	/* Covers */


	// Hooks
	
	Covers.created = function () {

		this.content = Projects;

	};
	
	Covers.mounted = function () {

		this.stage = new Paper.Project(this.$el);
		this.stage.view.viewSize = new Paper.Size(sw, sh);

		this.container = new Paper.Group();

		this.covers = [];
		_.each(this.content, (c, i) => {
			let cover = new Paper.Raster({
				source: c.cover.url,
				position: new Paper.Point(sw*.5, sh*.5),
				opacity: 0
			});
			cover.onLoad = function () {
				this.ratio = Math.max(sw/this.size.width, sh/this.size.height);
        this.size = new Paper.Size(this.size.width*this.ratio, this.size.height*this.ratio);
			};

			this.container.addChild(cover);
			this.covers.push(cover);
		});

	};





	/* Distorsion */


	// Hooks
	
	Distorsion.mounted = function () {

		new Ticker().tick('test', (f) => {
			this._animate(f);
		});

	};


	// Animation
	
	Distorsion.methods._animate = function (f) {

		_.each(this.shape.children, (c) => {
			_.each(c.segments, (s, i) => {
				s.point.x += Math.cos(f.count*.5 + i*2) * .3;
				s.point.y += -Math.sin(f.count*.5 + i*i) * .3;
			});
		});

	};
	
