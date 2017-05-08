


	/* Dependencies */

	import $ from 'jquery';
	import _ from 'lodash';




	/* Util */

	var Transitions = { methods: {}, };


	// Router
	
	Transitions.beforeRouteEnter = function (to, from, next) {

		console.log(to);
		next(vm => {
			if(vm.$parent.is.loaded){ vm.enter(from, to); }
		});

	};

	Transitions.beforeRouteLeave = function (to, from, next) {

		if(this.$parent.is.loaded){ this.leave(from, to); }
		next();

	}



	/* Export */

	export default Transitions;