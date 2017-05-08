


	/* Dependencies */

	import $ from 'jquery';
	import _ from 'lodash';




	/* Util */

	var Transitions = { methods: {}, };


	// Router
	
	Transitions.beforeRouteEnter = function (to, from, next) {
		
		next(vm => {
			if(vm.$parent.is.loaded){ 

				let settings = vm.getTransitionSettings("entering", from.name);

				vm.enter(settings, to, from); 

			}
		});

	};

	Transitions.beforeRouteLeave = function (to, from, next) {

		if(this.$parent.is.loaded){ this.leave(from, to); }
		next();

	}


	// Utils
	
	Transitions.methods.getTransitionSettings = function (direction, other) {

		if(!this.animations){ return {}; }
		else if(!this.animations[direction] && this.animations.default){ return this.animations.default; }

		var settings = this.animations[direction].default;

		let dest = this.animations[direction][other];
		if(dest){ settings = _.merge(settings, dest); }

		return settings;

	};



	/* Export */

	export default Transitions;