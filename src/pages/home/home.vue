



  <template lang="jade">
    
      background(v-bind:current="item")

  </template>


  <script>

    import Background from './background/background.vue';
    
    export default {
      name: 'home',
      data: function () {
        return { item: 1 }
      },
      mounted: function () {
        
        

      },
      components: {
        Background
      }
    }

  </script>
  