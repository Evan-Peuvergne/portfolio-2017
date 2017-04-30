


	/* Dependencies */

	import $ from 'jquery';
	import _ from 'lodash';

	import Ticker from '../../vendors/helpers/ticker.js';
	import Paper from 'paper';

	import Projects from '../projects.json';




	/* Util */

	var Shades = { methods: {}, };


	// Hooks
	
	Shades.created = function () {

		this.shadesParallax = { x: 0, y: 0 };

		this.shades = [];

	};
	
	Shades.beforeMount = function () {

		this.shadesContainer = new Paper.Group();
		this.shadesContainer.sendToBack();

		Projects.forEach(p => {

			let s = new Paper.PointText({ 
				content: p.glyph,
				point: [0, 0],
				fontFamily: 'Gotham Bold',
				color: 0x000,
				opacity: 0,
			});

			this.shadesContainer.addChild(s);

			this.shades.push(s);

		});

	};


	// Draw
	
	Shades.methods.drawShades = function (models, configs) {

		this.shades.forEach((s, i) => {

			let m = models[i];
			let c = configs[i];

			s.fontSize = sh*.8;

			s.position.x = m.position.x - c.offset.x*s.bounds.width;
			s.position.y = m.position.y;

			s.x = s.ox = s.position.x;
			s.y = s.oy = s.position.y;

		});

	};


	// Change
	
	Shades.methods.changeShade = function (prev, next) {

		this.timeline.fromTo(prev, .7, 
			{ y: prev.oy, },
			{ y: prev.oy - 300, ease: ease.elastic }, 0);
		this.timeline.fromTo(prev, .3, 
			{ opacity: .02 },
			{ opacity: 0, ease: ease.default }, .1);

		this.timeline.fromTo(next, .7, 
			{ y: next.oy + 300, },
			{ y: next.oy, ease: ease.elastic }, 0);
		this.timeline.fromTo(next, .3, 
			{ opacity: 0, },
			{ opacity: 0.02, ease: ease.default }, 0);

	};



	/* Export */

	export default Shades;