



	/**
	*
	*	TICKER|JS
	*	---------------
	*	DESC | Util for manager animation frames
	*	LOCATION | > scripts > utils > ticker.js
	*
	*/




	/*----------  Dependencies  ----------*/


	// Libs
	
	import $ from 'jquery';
	import _ from 'lodash';

	import Stats from 'stats.js';
	var stats = false;
	if(window.location.hostname == 'localhost') {
		stats = new Stats();
		stats.showPanel(0);
		document.body.appendChild(stats.dom);
		stats.dom.style.position = 'absolute';
		stats.dom.style.right = 0;
		stats.dom.style.left = 'auto';
		stats.dom.style.zIndex = 10000;
	}





	/*----------  Class  ----------*/



	// Singleton
	
	let instance;


	// Ticker
	
	class Ticker {

		
		/**
		 * Get a Ticker instance
		 * @return {Ticker} the Ticker instance
		 */
		constructor () {

			// Singleton
			if(!instance){ instance = this; }
			else{ return instance; }

			// Ticks
			this.ticks = [];
			this.ticksLength = 0;

			// Frame
			this.frame = null;

			// State
			this.is = { framing: false, };

			// Return
			return this;

		}


		/**
		 * Frame event function
		 * @return {Ticker} the ticker instance
		 */	
		framer () {
			
			// Stats
			if(stats){ stats.begin(); }

			// Functions
			_.forIn(this.ticks, (tick) => 
			{
				if(tick.pause){ return false; }
				tick.func(tick.stats);
				tick.stats.count++;
				tick.stats.time = new Date().getTime() - tick.stats.start;
			});

			// Frame
			if(stats){ stats.end(); }
			this.frame = window.requestAnimationFrame(() => this.framer());

		}


		/**
		 * Tick a new function
		 * @param {String} name the function name
		 * @param {Function} func the function to execute at each frame
		 * @param {Int} duration the optional duration of the tick
		 * @return {Ticker} the ticker instance
		 */
		tick (name, func, duration = null) {
			
			// Register
			if(!this.ticks[name]){ this.ticksLength++; }
			this.ticks[name] = { 
				name: name, 
				func: func, 
				duration: duration, 
				pause: false, 
				stats: { count: 0, start: new Date().getTime(), time: 0 }
			};

			// Framer
			if(!this.is.framing)
			{
				this.frame = window.requestAnimationFrame(() => this.framer());
				this.is.framing = true;
			}

			// Return
			return this;

		}

		
		/**
		 * Remove a function
		 * @param {String} name the name of the function to remove
		 * @return {Ticker} the ticker instance
		 */
		remove (name) {

			// Unregister
			if(this.ticks[name]){ delete this.ticks[name]; this.ticksLength--; }

			// Framer
			if(this.ticksLength < 1)
			{
				window.cancelAnimationFrame(this.frame);
				this.is.framing = false;
			}

			// Return
			return this;

		}

		
		/**
		 * Pause a function
		 * @param {String} name the name of the function to pause
		 * @return {Ticker} the ticker instance
		 */
		pause (name) {

			// State
			if(!this.ticks[name]){ return this; }

			// State
			this.ticks[name].pause = true;

			// Return
			return this;

		}


		/**
		 * Play a function
		 * @param {String} name the name of the function to play
		 * @return {Ticker} the ticker instance
		 */
		play (name) {

			// State
			if(!this.ticks[name]){ return this; }

			// State
			this.ticks[name].pause = false;

			// Return
			return this;

		}

		/**
		 * Check if a tick function exists for name
		 * @param  {String} name The function name
		 * @return {Boolean} If the function exist or not
		 */
		hasTick (name) {

			// Return
			if(!this.ticks[name]){ return false; }
			else{ return true; }

		}

	}


	// Export
	
	export default Ticker;
	

	
	
	