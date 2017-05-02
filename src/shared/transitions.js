


	/* Dependencies */

	import $ from 'jquery';
	import _ from 'lodash';




	/* Util */

	var Transitions = { methods: {}, };


	// Router
	
	Transitions.beforeRouteEnter = function (to, from, next) {

		next(vm => {
			if(vm.$parent.is.loaded){ vm.enter(); }
		});

	};

	Transitions.beforeRouteLeave = function (to, from, next) {

		if(this.$parent.is.loaded){ this.leave(); }
		next();

	}



	/* Export */

	export default Transitions;