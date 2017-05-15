

  /* Dependencies */

  import $ from 'jquery';
  import _ from 'lodash';

  import Paper from 'paper';

  import { TimelineMax } from 'gsap';

  import Projects from '../projects.json';
  import AboutConfig from '../../pages/about/config.json';



  /* Class */

  class StageStore {


    // Constructor
    
    constructor () {

      // Canvas
      this.canvas = new Paper.Project();
      this.view = this.canvas.view;

      this.model = new Paper.CompoundPath();
      this.tracker = new Paper.CompoundPath();

      // Covers
      this.covers = {
        items: [],
        default: true,
        current: 0,
      };

      Projects.forEach(p => { this.addCover(p.id, p.cover.url); });
      this.addCover('about', AboutConfig.cover);


      // States
      this.is = {
        active: true,
        sourcing: false,
        mousing: false,
        parallaxing: false,
        tracking: false,
        distording: false,
      };

      this.distorsion = { 
        frequency: 0.025,
        amplitude: 0.4,
      };
      
      this.mouse = { 
        orth: { x: 0.5, y: 0.5 },
        abs: { 
          x: window.innerWidth*.5, 
          y: window.innerHeight*.5,
        }
      };

      $(window).on('mousemove', this.mousemove.bind(this));

    };


    // States
    
    set active (val) { this.is.active = val; }

    set sourcing (val) { this.is.sourcing = val; }

    set mousing (val) { 

      this.is.mousing = val; 

      // if(val){ $(window).on('mousemove', this.mousemove.bind(this)); }
      // else{ console.log('coucou'); $(window).off('mousemove', this.mousemove.bind(this)); }

    }

    set parallaxing (val) { 

      this.is.parallaxing = val;
      this.updateMousing();

    }

    set tracking (val) {

      this.is.tracking = val;
      this.updateMousing();

    }

    set distording (val) { this.is.distording = val; }

    
    updateMousing () {

      if(this.is.parallaxing || this.is.tracking){ 
        if(!this.is.mousing){ this.mousing = true; }
      }

      else{ 
        if(this.is.mousing){ this.mousing = false; }
      }
      
    }


    // Covers

    set cover (val) {

      this.covers.items[this.covers.current].active = false;

      this.covers.current = _.findIndex(this.covers.items, o => { return o.name == val; });
      this.covers.items[this.covers.current].active = true;

    }

    addCover (id, url) {

      let i = _.findIndex(this.covers.items, o => { return o.name === id });
      if(i >= 0){ return false; }

      this.covers.items.push({
        name: id,
        url: url, 
        active: false,
      });

    }


    // Shadow
    
    getShadow (config) {

      var shadow = {
        fillColor: config.color,
        shadowColor: config.color, 
        shadowBlur: 60,
        opacity: config.opacity,
        ease: ease.default
      };

      return shadow;

    }

    mousemove (e) {

      this.mouse.abs.x = e.clientX;
      this.mouse.abs.y = e.clientY;

      this.mouse.orth.x = e.clientX/sw - .5;
      this.mouse.orth.y = e.clientY/sh - .5;

    }

  }



  /* Export */

  export default new StageStore();


