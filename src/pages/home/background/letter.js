



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

      p.cover = new Raster({ 
        source: content.cover.url, 
        position: this.canvas.view.center 
      });
      p.cover.onLoad = function () {
        var ratio = Math.max(S.window.w/this.size.width, S.window.h/this.size.height);
        this.size = new Size(this.size.width*ratio, this.size.height*ratio);
        this.opacity = 10;
      };
      
      return p;

    }

    
    /**
     * Launch the first slide for index
     * @param  {Number} index The index of the first slide
     */
    launch (index = 0) {

      this.letter.children = this.projects[index].letter.children;

      var color = new Color(this.content[index].shadow.color);
      color.alpha = this.content[index].shadow.opacity;
      this.letter.fillColor = new Color(this.content[index].shadow.color);
      this.letter.shadowColor = color;

      var color = new Color(this.content[index].shadow.color);
      console.log(color);

      this.projects[index].cover.opacity = 1;

      this.canvas.view.onFrame = (f) => {

        _.each(this.letter.children, (c) => {
          _.each(c.segments, (s, i) => {
            s.point.x += Math.cos(f.count*.5 + 2*i) * .25;
            s.point.y += -Math.sin(f.count*.5 + 2*i) * .25;
          });
        });

      };
      this.canvas.view.play();

    }

    /**
     * Go to a specific slide with index
     * @param  {Number} index The index of the destination slide
     */
    go (index) {



    }

    previous () { let i = this.current-1; this.go((i >= 0) ? i : this.projects.length-1); }  
    
    next () { this.go((this.current+1)%this.projects.length); }

  }




  /* Export */

  export default Letter;