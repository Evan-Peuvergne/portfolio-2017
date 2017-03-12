


	
	/* Dependencies */


	import _ from 'lodash';
    
    import SVG from 'svg.js';
    import SVGFilter from 'svg.filter.js';

    import { TweenMax } from 'gsap';
    import Morph from '../../../shared/libs/MorphSVGPlugin.js';
    import findIndex from './utils.js';

    import S from '../../../shared/helpers/sizes.js';



    /* Class */

    class Stage {


    	// Constructor
    	
    	constructor (config = {}) {

    		// Canvas
  			this.element = config.element;

    		this.canvas = SVG(this.element);
    		this.canvas.size(S.window.w, S.window.h);

    		// Return
    		return this;

    	}


    	// Init
    	
    	init (content = []) {

    		// Properties
    		this.content = content;

    		// Structure
    		this.letter = this.canvas.path();
    		this.backgrounds = this.canvas.group();

    		this.mask = this.canvas.clip().add(this.letter);
    		this.backgrounds.clipWith(this.mask);

    		this.letter.filter(function (f) {
    			var blur = f.offset(0, 0).gaussianBlur(20);
    			f.blend(f.source, blur);
    			this.size('200%', '200%').move('-50%', '-50%');
    			console.log('coucou');
    		});

    		// Content
    		this.projects = [];
    		_.each(content, _.bind(function (c, i) {
    			this.projects.push(this.initProject(c));
    			this.projects[i].background.addTo(this.backgrounds).back();
    		}, this));

    	}

    	initProject (content = {}) {

    		// Properties
    		var project = { letter: null, shade: null, background: null, };

    		// Letter
			project.letter = this.canvas.path(content.letter.path);
    		this.canvas.defs().put(project.letter);

    		project.letter.size(null, S.window.h*content.letter.size);
    		project.letter.x(S.window.w*0.5 - project.letter.width()*(1-content.letter.offset.x) - 25);
    		project.letter.y(S.window.h*0.5 - project.letter.height()*(0.5-content.letter.offset.y));

    		// Background
    		project.background = this.canvas.image(content.cover.url);
    		project.background.size(S.window.w, S.window.h);
    		project.background.attr({ preserveAspectRatio: 'xMidYMid slice' });
    		
  			// Return
    		return project;

    	}


    	// Launch
    	
    	launch (starter = 0) {

    		// Properties
    		this.current = starter;

    		// Draw
    		this.letter.attr({ d: this.projects[this.current].letter.attr('d') });

    	}


    	// Transition
    	
    	go (index) {

    		// Properties
    		this.current = index;

    		// Morph
    		TweenMax.to(this.letter.node, 0.75, {
    			morphSVG: this.projects[index].letter.node,
    			ease: Elastic.easeOut.config(1, 1),
    		});

    		// Background
    		TweenMax.set(this.projects[index].background.node, { opacity: 0, scale: 2, transformOrigin: '50% 50%' });
    		this.projects[index].background.front();

    		TweenMax.to(this.projects[index].background.node, 0.5, {
    			opacity: 1,
    			scale: 1,
    			ease: Power4.easeOut,
    		});

    	}

    	previous () { var i = this.current-1; this.go((i >= 0) ? i : this.projects.length-1); }
    	
    	next () { this.go((this.current+1)%this.projects.length); }

    }



    /* Export */

    export default Stage;