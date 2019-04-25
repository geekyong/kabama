<template>
  <div>
    <v-parallax
      :height="getHeight"
      dark
      src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
    >
      <v-layout
        align-start
        justify-center
        column
      >
        <h1 class="display-2 font-weight-thin mb-3">Kabama</h1>
        <h4 class="subheading">An Interactive Media Homework</h4>
        <v-btn dark depressed color="transparent" large @click="jumpToCanvas">
          Click Here To Start
        </v-btn>
      </v-layout>
    </v-parallax>
  </div>

</template>

<script>
export default {
  name: 'Home',
  computed: {
    getHeight () {
      return window.innerHeight - 70
    }
  },
  methods: {
    jumpToCanvas () {
      this.$router.push('/canvas')
    }
  }
}
</script>

<style scoped>

</style>
