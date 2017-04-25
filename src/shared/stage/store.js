

  /* Dependencies */

  import $ from 'jquery';
  import _ from 'lodash';

  import Paper from 'paper';

  import { TimelineMax } from 'gsap';

  import Projects from '../projects.json';



  /* Class */

  class StageStore {


    // Constructor
    
    constructor () {

      // Canvas
      this.canvas = new Paper.Project();
      this.view = this.canvas.view;
      this.shape = new Paper.CompoundPath();

      // Covers
      this.covers = {
        items: [],
        default: true,
        current: 0,
      };

      // States
      this.active = true;
      this.sourcing = false;

      this._parallaxing = false;
      this._distording = false;

      this.distorsion = { 
        frequency: 0.025,
        amplitude: 0.4,
      };
      
      this.mouse = { x: 0, y: 0 };

    };


    // Covers

    set cover (val) {

      this.covers.items[this.covers.current].active = false;

      this.covers.current = _.findIndex(this.covers.items, o => { return o.name == val; });
      this.covers.items[this.covers.current].active = true;

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


    // Parallax
    
    get parallaxing () {

      return this._parallaxing;

    }

    set parallaxing (val) {

      this._parallaxing = val;

      if(val){ $(window).on('mousemove', this.mousemove.bind(this)); }
      else{ $(window).off('mousemove', this.mousemove.bind(this)); }

    }

    mousemove (e) {

      this.mouse.x = e.clientX/sw - .5;
      this.mouse.y = e.clientY/sh - .5;

    }


    // Distorsion
    
    get distording () {

      return this._distording;

    }


    set distording (val) {

      this._distording = val;

    }

  }



  /* Export */

  export default new StageStore();


