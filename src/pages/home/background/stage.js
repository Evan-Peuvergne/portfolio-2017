


	
	/* Dependencies */


	import _ from 'lodash';
    import SVG from 'svg.js';

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
    		this.backgrounds = this.canvas.group();

    		this.mask = this.canvas.clip();
    		this.backgrounds.clipWith(this.mask);

    		// Content
    		this.projects = [];
    		_.each(content, _.bind(function (c, i) {
    			this.projects.push(this.initProject(c));
    			this.backgrounds.add(this.projects[i].background);
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
    	
    	launch (starter = 0){

    		// Properties
    		this.current = 0;

    		// Draw
    		// ...

    	}

    }



    /* Export */

    export default Stage;