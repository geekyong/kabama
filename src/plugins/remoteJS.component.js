import Vue from 'vue'
Vue.component('remote-js', {
  render (createElement, hack) {
    return createElement('script', {
      attrs: {
        type: 'text/javascript',
        src: this.src
      }
    })
  },
  props: {
    src: {
      type: String
    }
  }
})
