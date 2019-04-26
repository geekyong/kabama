<template>
  <div>
    <v-parallax
      :height="getHeight"
      dark
      :src="kb"
    >
      <v-layout
        align-center
        justify-space-around
        row
        wrap
        fill-height
        offset-xs4
      >
        <v-flex>
          <v-layout column class="text-xs-center">
            <h1 class="display-3 mb-3">Kabama</h1>
            <h4 class="headline">An Interactive Media Homework</h4>
            <h4 class="subheading">WASD Control Hero</h4>
            <h4 class="subheading">Press "r" To Restart </h4>

            <v-btn dark outline color="white" class="display-1" @click="jumpToCanvas">
              Press Here To Start
            </v-btn>

          </v-layout>
        </v-flex>
        <v-flex>

        </v-flex>
        <v-flex />
      </v-layout>
    </v-parallax>
  </div>

</template>

<script>
import KB from '../assets/kb.png'
export default {
  name: 'Home',
  data: () => ({
    kb: KB
  }),
  computed: {
    getHeight () {
      return window.innerHeight - 60
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
