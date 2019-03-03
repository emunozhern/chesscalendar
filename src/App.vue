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
import { faClock, faExternalLinkAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faComment } from '@fortawesome/free-regular-svg-icons'
import { faTwitter, faFacebook, faPinterest, faReddit } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faClock,
            faExternalLinkAlt,
            faEnvelope,
            faTwitter,
            faFacebook,
            faPinterest,
            faReddit
            )
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false
import VueSelect from 'vue-cool-select'

Vue.use(VueSelect, {
  theme: 'material-design' // or 'material-design'
})

var SocialSharing = require('vue-social-sharing');
Vue.use(SocialSharing);

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
