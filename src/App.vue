<template>
    <div :style="styles">
        <Calendar :countrys="countrys"/>
    </div>
</template>

<script>


import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faClock, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faClock, faExternalLinkAlt)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false
import VueSelect from 'vue-cool-select'

Vue.use(VueSelect, {
  theme: 'material-design' // or 'material-design'
})

import Calendar from './components/calendar.vue'
import { getCountry } from './api'


export default {
  name: 'app',
   data () {
    return {
      countrys: [],
      styles: {}
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
  }
  
}
</script>

<style>
#app {
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
</style>
