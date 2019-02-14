<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
        <!-- <Spinner v-show="load"/> -->
        <Calendar :countrys="countrys"/>
  </div>
</template>

<script>

import Calendar from './components/calendar.vue'
import { getCountry } from './api'

export default {
  name: 'app',
   data () {
    return {
      countrys: [],
    }
  },
  components: {
    Calendar,
  },
  methods: {
    getAllCountrys() {
      const self = this
      this.countrys = []
      
      getCountry().then(c => {
          self.countrys = c
      })
    }
  },
  mounted() {
    this.getAllCountrys()
  },
}
</script>

<style>
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
  /* -webkit-font-smoothing: antialiased; */
  /* -moz-osx-font-smoothing: grayscale; */
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
