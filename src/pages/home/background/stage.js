



  /**
  *
  *   STAGE|JS
  *   ---------------
  *   Class managing the home background canvas stage
  *   pages > home > background > stage.js
  *
  */
  


  /*----------  Dependencies  ----------*/



  // Libs

  import _ from 'lodash';
  import $ from 'jquery';
  import { TweenMax } from 'gsap';

  import Paper from 'paper';
  Paper.install(window);


  // Helpers

  import S from '../../../shared/helpers/sizes.js';
  import Ticker from '../../../shared/helpers/ticker.js';



  


  /*----------  Class  ----------*/



  // Definition

  class Stage {


    /**
     * Create a Letter instance
     * @param  {Object} config The configuration options
     * @return {Letter} The created instance
     */
    constructor (config = {}) {

      this.elems = {
        letter: config.canvasLetter,
        tracker: config.canvasTracker,
        shade: config.canvasShade,
      };

      this.canvas = {};
      _.each(this.elems, (s, n) => {
        this.canvas[n] = new Project(s);
        this.canvas[n].view.viewSize = new Size(S.window.w, S.window.h);
      });

      return this;

    }
    
    /**
     * Inject content in the Letter instance
     * @param  {Array} content The projects content array
     */
    init (content = []) {

      this.content = content;
      this.projects = [];

      this.canvas.letter.activate();
      this.letter = new CompoundPath();
      this.letter.fillColor = "#000";
      this.letter.strokeWidth = 0;
      this.letter.shadowColor = '#000'
      this.letter.shadowBlur = 50;

      this.define = new SymbolDefinition(this.letter);
      this.mask = new SymbolItem(this.define);
      this.canvas.shade.activate();
      this.shadow = new SymbolItem(this.define);

      this.containers = {};

      this.canvas.letter.activate();
      this.containers.letter = new Group();
      this.containers.letter.addChild(this.mask);
      this.containers.letter.clipped = true;

      this.canvas.tracker.activate();
      this.containers.tracker = new Group();
      this.tracker = new Path.Circle({
        center: [S.window.w/2, S.window.h/2],
        radius: S.window.h*0.07,
      });
      this.tracker.fillColor = '#000';
      this.tracker.flatten(8);
      this.tracker.smooth();
      _.each(this.tracker.segments, (s, i) => {
        s.origin = new Point(s.point);
        s.origin.x -= this.tracker.position.x;
      });
      this.containers.tracker.addChild(this.tracker);
      this.containers.tracker.clipped = true;

      _.each(this.content, (c, i) => { 
        let p = this._initProject(c, i);
        this.projects.push(p); 
      });

    }

    _initProject (content, index) {

      var p = { letter: null, shade: null, cover: [], };

      this.canvas.letter.activate();
      p.letter = new CompoundPath(content.letter.path);
      if(index == 2){ console.log(p.letter); }
      p.letter.visible = false;
      p.letter.fitBounds(new Rectangle({
        point: [ 0, S.window.h*(1-content.letter.size)/2 ],
        size: [ S.window.w, S.window.h*content.letter.size ]
      }));
      p.letter.position.x = S.window.w*.5 - p.letter.bounds.width*(1-content.letter.offset.x) - 25;
      p.letter.position.y = S.window.h*.5 - p.letter.bounds.height*content.letter.offset.y;  

      ['letter', 'tracker'].forEach((c, i) => {
        this.canvas[c].activate();
        p.cover[i] = new Raster({
          source: content.cover.url,
          position: this.canvas[c].view.center
        })
        p.cover[i].onLoad = function () {
          this.ratio = Math.max(S.window.w/this.size.width, S.window.h/this.size.height);
          this.size = new Size(this.size.width*this.ratio, this.size.height*this.ratio);
        }
        this.containers[c].addChild(p.cover[i]);
      });

      this.canvas.shade.activate();
      p.shade = new PointText({
        point: [0, 0],
        content: content.glyph,
        fontFamily: 'Gotham Bold',
        fontSize: S.window.h*0.8,
        opacity: 0
      });
      p.shade.point.x = p.letter.position.x - p.shade.bounds.width * (content.shade.offset.x + .5);
      p.shade.point.y = p.letter.position.y + p.shade.bounds.height * (content.shade.offset.y + .25);
      p.shade.anchor = { x: p.shade.position.x, y: p.shade.position.y };
      
      return p;

    }

    
    /**
     * Launch the first slide for index
     * @param  {Number} index The index of the first slide
     */
    launch (index = 0) {

      this.current = 0;
      this.prev = null;

      this._isMorphing = false;

      this.letter.children = _.cloneDeep(this.projects[index].letter.children);
      this.letter.anchor = { x: this.letter.position.x, y: this.letter.position.y };

      var color = new Color(this.content[index].shadow.color);
      color.alpha = this.content[index].shadow.opacity;
      this.letter.fillColor = new Color(this.content[index].shadow.color);
      this.letter.shadowColor = color;

      this.projects[index].shade.opacity = 0.02;

      _.each(this.projects, (p, i) => {
        _.each(p.cover, (c) => {
          c.opacity = (i == index) ? 1 : 0;
        });
      });

      this.mouse = { x: 0, y: 0 };
      $(window).on('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });
      
      this.canvas.letter.view.onFrame = (f) => {
        this._parallax();
        this._track();
        this._distorsion(f.count);
      };

      this.canvas.letter.view.play();
      this.canvas.tracker.view.play();

    }

    
    /**
     * Go to a specific slide with index
     * @param  {Number} index The index of the destination slide
     */
    go (index) {

      this.prev = this.current;
      this.current = index;

      this._isMorphing = true;

      var tl = new TimelineMax({ onComplete: () => {  } });

      tl.add(this._morph(this.projects[this.current]));

      tl.to(this.projects[this.prev].cover, .5, { opacity: 0, ease: Power2.easeOut }, 0);
      tl.to(this.projects[this.current].cover, .5, { opacity: 1, ease: Power2.easeOut }, 0);

      var color = new Color(this.content[this.current].shadow.color);
      color.alpha = this.content[this.current].shadow.opacity;
      tl.to(this.letter, .5, { fillColor: this.content[this.current].shadow.color, ease: Power4.easeOut }, 0);
      tl.to(this.letter.shadowColor, .5, { red: color.red, green: color.green, blue: color.blue, alpha: color.alpha, ease: Power4.easeOut}, 0);

      tl.to(this.projects[this.prev].shade.position, .5, { y: this.projects[this.prev].shade.position.y-S.window.h*0.2, ease: Elastic.easeOut.config(1, .9) }, 0);
      TweenMax.set(this.projects[this.current].shade.position, { y: this.projects[this.current].shade.anchor.y+S.window.h*0.2 });
      tl.to(this.projects[this.current].shade.position, .5, { y: this.projects[this.current].shade.anchor.y, ease: Elastic.easeOut.config(1, .9) }, 0);

      tl.to(this.projects[this.prev].shade, .5, { opacity: 0 }, 0);
      tl.to(this.projects[this.current].shade, .5, { opacity: 0.02 }, 0);

    }

    _morph (target) {

      var morphs = [];

      let timeline = new TimelineMax({ onComplete: () => { this._isMorphing = false; } });
      let ease = Elastic.easeOut.config(1, .9);

      morphs.push({
        from: _.last(this.letter.children),
        to: _.last(target.letter.children),
        start: this.content[this.current].letter.transition.origin,
      });

      if(this.letter.children.length > 1) {
        
        let dest = _.cloneDeep(this.letter.children[0]);
        let x = dest.bounds.x+dest.bounds.width/2;
        let y = dest.bounds.y+dest.bounds.height/2;
        
        _.each(dest.segments, (s, i) => {
          s.point.x = x; s.point.y = y;
          s.handleIn.x = 0; s.handleIn.y = 0;
          s.handleOut.x = 0; s.handleOut.y = 0;
        });

        morphs.push({
          from: this.letter.children[0],
          to: dest,
          start: 0,
          callback: () => { this.letter.children.splice(0, 1); }
        });

      }

      if(target.letter.children.length > 1) {

        let source = _.cloneDeep(target.letter.children[0]);
        this.letter.children.unshift(source);
        let x = source.bounds.x+source.bounds.width/2;
        let y = source.bounds.y+source.bounds.height/2;

        _.each(source.segments, (s, i) => {
          s.point.x = x; s.point.y = y;
          s.handleIn.x = 0; s.handleIn.y = 0;
          s.handleOut.x = 0; s.handleOut.y = 0;
        });

        morphs.push({
          from: this.letter.children[0], 
          to: target.letter.children[0],
          start: 0
        })

      }

      _.each(morphs, (m) => {

        let tl = new TimelineMax({ onComplete: () => {
          if(m.callback) { m.callback(); }
        }});
        timeline.add(tl, 0);

        for(var i=0; i<m.from.segments.length; i++) {
          let c = (i+m.start)%m.from.segments.length;
          let s = m.from.segments[c], t = m.to.segments[c];
          tl.to(s.point, .75, { x: t.point.x, y: t.point.y, delay: i*.005, ease: ease }, 0);
          tl.to(s.handleIn, .75, { x: t.handleIn.x, y: t.handleIn.y, delay: i*.005, ease: ease }, 0);
          tl.to(s.handleOut, .75, { x: t.handleOut.x, y: t.handleOut.y, delay: i*.005, ease: ease }, 0);
        }

      });

      timeline.to(this.letter.anchor, .75, {
        x: this.projects[this.current].letter.position.x,
        y: this.projects[this.current].letter.position.y,
      }, 0);

      return timeline;

    }

    
    /**
     * Utility function to distord the current letter
     * @param  {Number} frame The current frame
     */
    _distorsion (frame) {

      let settings = this.content[this.current].letter.distorsion;

      _.each(this.letter.children, (c) => {
        _.each(c.segments, (s, i) => {
          s.point.x += Math.cos(frame*settings.frequency + i*2) * settings.amplitude;
          s.point.y += -Math.sin(frame*settings.frequency + i*i) * settings.amplitude;
        });
      });

      _.each(this.tracker.segments, (s, i) => {
        s.point.x += Math.cos(frame*.3 + i*2) * .5;
        s.point.y += -Math.sin(frame*.3 + i*i) * .5;
      });

    }


    /**
     * Utility function to create the parallax effect on letter
     */
    _parallax () {

      let x = this.mouse.x/S.window.w - 0.5;
      let y = this.mouse.y/S.window.h - 0.5;

      var ratio = 30;
      if(!this._isMorphing) {
        this.letter.position.x += ((x*ratio + this.letter.anchor.x) - this.letter.position.x)*0.1;
        this.letter.position.y += ((y*ratio + this.letter.anchor.y) - this.letter.position.y)*0.1;
      }

      ratio = 75;
      var anchor = this.projects[0].shade.anchor; 
      var shade = this.projects[this.current].shade;
      shade.position.x += ((x*ratio + shade.anchor.x) - shade.position.x)*0.1;
      shade.position.y += ((y*ratio + shade.anchor.y) - shade.position.y)*0.1;

    }


    /**
     * Utility function to manage the tracker animation
     */
    _track () {
      
      var delta = new Point(this.mouse.x, this.mouse.y);
      
      this.tracker.position.x += (delta.x - this.tracker.position.x)*0.1;
      this.tracker.position.y += (delta.y - this.tracker.position.y)*0.1;
      
      // _.each(this.tracker.segments, (s, i) => {
      //   let dist = s.point.getDistance(delta);
      //   let pct = dist/(S.window.h*0.07);
        
      //   var x = delta.x * pct;
      //   var y = delta.y * pct;

      //   var destX = s.point.x - x;
      //   var destY = s.point.y - y;

      //   s.point.x += (destX - s.point.x) * 0.33;
      //   s.point.y += (destY - s.point.y) * 0.33;
      // });

    }

  }


  // Export

  export default Stage;