



  <template lang="jade">
    
      background(v-bind:current="item")

  </template>


  <script>

    import Background from './background.vue';
    
    export default {
      name: 'home',
      data: function () {
        return { item: 0 }
      },
      mounted: function () {
        
        var that = this;
        setTimeout(function () {
          that.item = 3;
        }, 3000);

      },
      components: {
        Background
      }
    }

  </script>
  