


	
	/* Dependencies */

    import $ from 'jquery';
	import _ from 'lodash';
    
    import SVG from 'svg.js';
    import SVGFilter from 'svg.filter.js';
    import Two from 'imports-loader?this=>window,fix=>module.exports=0!two.js/build/two.js';

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

            this.util = new Two({ width: S.window.w, height: S.window.h, });
            this.util.renderer.domElement = this.element;
            this.util.renderer.defs = this.canvas.defs().node;

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

            this.shadow = this.canvas.use(this.letter);
            this.shadow.after(this.backgrounds);
            this.shadow.filter(function (f) {
                var b = f.offset(0, 0).gaussianBlur(10);
                f.blend(f.source, b);
                this.size('200%', '200%').move('-50%', '-50%');
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
            var letterBox = project.letter.bbox();

            // Shade
            project.shade = this.canvas.text(content.glyph);
            project.shade.font({ family: 'Gotham Bold', size: S.window.h*0.8 });
            project.shade.opacity(0);

            var size = project.shade.bbox();
            $(project.shade.node).css({ transformOrigin: letterBox.cx + 'px ' + letterBox.cy + 'px' });
            project.shade.x(project.letter.x() + project.letter.width()*0.5 - size.w*0.5);
            project.shade.y(project.letter.y() + project.letter.height()*0.5 - size.h*0.5);

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
            this.prev = null;

    		// Letter
    		this.letter.attr({ d: this.projects[this.current].letter.attr('d') });
            // this.letter.opacity(0);

            this.distortion = this.util.interpret(this.letter.node);
            this.util.render();
            $(this.distortion._renderer.elem).css({ opacity: 0 });
            this.distortion._renderer.elem = this.letter.node;

            this.util.bind('update', (f) => {
                _.each(this.distortion.vertices, (v, i) => {
                    v.x += Math.cos(f*.7 + i*100) * 0.65;
                    v.y += -Math.sin(f*.7 + i*100) * 0.65;
                });
            });
            this.util.play();

            // Shadow
            this.shadow.fill(this.content[this.current].shadow.color);
            this.shadow.opacity(this.content[this.current].shadow.opacity);

            // Shade
            this.projects[this.current].shade.opacity(0.02);

            // Background
            this.projects[this.current].background.front();
    	}


    	// Transition
    	
    	go (index) {

    		// Properties
            this.prev = this.current;
    		this.current = index;

    		// Morph
    		TweenMax.to(this.letter.node, 0.4, {
    			morphSVG: this.projects[index].letter.node,
    			// ease: Elastic.easeOut.config(1, 1),
                ease: Power3.easeOut,
    		});

            // Background
            TweenMax.to(this.shadow.node, 0.5, {
                fill: this.content[this.current].shadow.color,
                opacity: this.content[this.current].shadow.opacity
            });

            // Shade
            TweenMax.to(this.projects[this.prev].shade.node, 0.5, { 
                opacity: 0 
            });
            
            TweenMax.set(this.projects[this.current].shade.node, { opacity: 0, scale: 0.5 });
            TweenMax.to(this.projects[this.current].shade.node, 0.5, {
                opacity: 0.02, 
                scale: 1,
                ease: Power3.easeOut,
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