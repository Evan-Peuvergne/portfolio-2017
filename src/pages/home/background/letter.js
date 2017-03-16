



  /* Dependencies */
  
  import _ from 'lodash';

  import { TweenMax } from 'gsap';

  import Paper from 'paper';
  Paper.install(window);

  import S from '../../../shared/helpers/sizes.js';



  /* Class */

  class Letter {

    /**
     * Create a Letter instance
     * @param  {Object} config The configuration options
     * @return {Letter} The created instance
     */
    constructor (config = {}) {

      this.elem = config.element;

      this.canvas = new Project(this.elem);
      this.canvas.view.viewSize = new Size(S.window.w, S.window.h);

      return this;

    }
    
    /**
     * Inject content in the Letter instance
     * @param  {Array} content The projects content array
     * @return {Letter} The Letter instance
     */
    init (content = []) {

      this.content = content;
      this.projects = [];

      this.letter = new CompoundPath();
      this.letter.fillColor = "#000";
      this.letter.strokeWidth = 0;
      this.letter.shadowColor = '#000'
      this.letter.shadowBlur = 50;

      this.define = new SymbolDefinition(this.letter);
      this.mask = new SymbolItem(this.define);
      this.shadow = new SymbolItem(this.define);

      this.container = new Group();
      this.container.addChild(this.mask);
      this.container.clipped = true;

      _.each(this.content, (c, i) => { 
        let p = this._initProject(c, i);
        this.container.addChild(p.cover);
        this.projects.push(p); 
      });

    }

    _initProject (content, index) {

      var p = { letter: null, shade: null, cover: null, };

      p.letter = new CompoundPath(content.letter.path);
      p.letter.visible = false;
      p.letter.fitBounds(new Rectangle({
        point: [ 0, S.window.h*(1-content.letter.size)/2 ],
        size: [ S.window.w, S.window.h*content.letter.size ]
      }));
      p.letter.position.x = S.window.w*.5 - p.letter.bounds.width*(1-content.letter.offset.x) - 25;
      p.letter.position.y = S.window.h*.5 - p.letter.bounds.height*content.letter.offset.y;

      p.shade = new PointText({
        point: [0, 0],
        content: content.glyph,
        fontFamily: 'Gotham Bold',
        fontSize: S.window.h*0.8,
        opacity: 0
      });
      p.shade.point.x = p.letter.position.x - p.shade.bounds.width * (content.shade.offset.x + .5);
      p.shade.point.y = p.letter.position.y + p.shade.bounds.height * (content.shade.offset.y + .25);

      p.cover = new Raster({ 
        source: content.cover.url, 
        position: this.canvas.view.center,
      });
      p.cover.onLoad = function () {
        var ratio = Math.max(S.window.w/this.size.width, S.window.h/this.size.height);
        this.size = new Size(this.size.width*ratio, this.size.height*ratio);
        this.opacity = 0;
      };
      
      return p;

    }

    
    /**
     * Launch the first slide for index
     * @param  {Number} index The index of the first slide
     */
    launch (index = 0) {

      this.current = 0;
      this.prev = null;

      this.letter.children = _.cloneDeep(this.projects[index].letter.children);

      var color = new Color(this.content[index].shadow.color);
      color.alpha = this.content[index].shadow.opacity;
      this.letter.fillColor = new Color(this.content[index].shadow.color);
      this.letter.shadowColor = color;

      this.projects[index].shade.opacity = 0.02;

      this.canvas.view.onFrame = (f) => {
        _.each(this.letter.children, (c) => {
          _.each(c.segments, (s, i) => {
            s.point.x += Math.cos(f.count*.4 + i*2) * .25;
            s.point.y += -Math.sin(f.count*.4 + i*i) * .25;
          });
        })
      };
      this.canvas.view.play();

    }

    /**
     * Go to a specific slide with index
     * @param  {Number} index The index of the destination slide
     */
    go (index) {

      this.prev = this.current;
      this.current = index;

      let from = this.letter.children[this.letter.children.length-1];
      let to = this.projects[index].letter.children[this.projects[index].letter.children.length-1];

      var tl = new TimelineMax({ 
        onComplete: () => {} 
      });
      var e = Elastic.easeOut.config(1, 0.9);

      let start = this.content[index].letter.transition.origin;
      for(var i=0; i<from.segments.length; i++) {
        let c = (i+start)%from.segments.length;
        let t = to.segments[c];
        let s = from.segments[c];
        tl.to(s.point, .75, { x: t.point.x, y: t.point.y, delay: i*.005, ease: e}, 0);
        tl.to(s.handleIn, .75, { x: t.handleIn.x, y: t.handleIn.y, delay: i*.005, ease: e}, 0);
        tl.to(s.handleOut, .75, { x: t.handleOut.x, y: t.handleOut.y, delay: i*.005, ease: e}, 0);
      }

      TweenMax.to(this.projects[this.prev].cover, .5, { opacity: 0, ease: Power2.easeOut });
      TweenMax.to(this.projects[this.current].cover, .5, { opacity: 1, ease: Power2.easeOut });

      var color = new Color(this.content[this.current].shadow.color);
      color.alpha = this.content[this.current].shadow.opacity;
      TweenMax.to(this.letter.shadowColor, .5, { red: color.red, green: color.green, blue: color.blue, alpha: color.alpha});

      TweenMax.to(this.projects[this.prev].shade.point, 0.5, { y: this.projects[this.prev].shade.point.y-S.window.h*0.2, ease: e });
      TweenMax.set(this.projects[this.current].shade.point, { y: this.projects[this.prev].shade.point.y+S.window.h*0.2 });
      TweenMax.to(this.projects[this.current].shade.point, 0.5, { y: this.projects[this.prev].shade.point.y, ease: e });

      TweenMax.to(this.projects[this.prev].shade, 0.5, { opacity: 0 });
      TweenMax.to(this.projects[this.current].shade, 0.5, { opacity: 0.02 });

    }

    previous () { let i = this.current-1; this.go((i >= 0) ? i : this.projects.length-1); }  
    
    next () { this.go((this.current+1)%this.projects.length); }


    _animate

  }




  /* Export */

  export default Letter;