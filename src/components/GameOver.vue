<template>
  <div>
    <v-p5 @sketch="sketch" v-show="isOver"></v-p5>
    <v-layout style="transform: translate3d(0,-50em,0)" column justify-center align-center class="text-xs-center">
      <v-card-text class="display-4 cyan--text">You Lose</v-card-text>
      <v-btn dark flat outline large depressed color="cyan" @click="restart">Press To Restart</v-btn>
    </v-layout>
  </div>

</template>

<script>
export default {
  name: 'GameOver',
  computed: {
    isOver: {
      set (val) {
        this.$store.state.isOver = val
      },
      get () {
        return this.$store.state.isOver
      }
    }
  },
  methods: {
    restart () {
      this.isOver = false
      this.$router.push('/')
    },
    sketch (sk) {
      let width = window.innerWidth
      let height = window.innerHeight - 70

      let time = 0
      sk.setup = () => {
        sk.createCanvas(width, height)
        sk.smooth()
        sk.stroke(255)
      }

      sk.draw = () => {
        if (sk.mouseIsPressed) {
          let hit = sk.collidePointRect(sk.mouseX, sk.mouseY, sk.width / 2 - width / 6, sk.height * 0.15 - height / 40, width / 3, height / 20)
          if (hit) {
            this.isOver = false
            window.location.href = '/'
            return
          }
        }
        sk.background(242)
        sk.rectMode(sk.CENTER)

        for (let i = 0; i < 360; i += 3) {
          let x = sk.cos(sk.radians(i)) * 50 + width / 2
          let y = sk.sin(sk.radians(i)) * 100 + height * 0.6
          let w = sk.sin(sk.radians(time + i)) * 200
          w = sk.abs(w)

          let col = sk.map(i, 0, 360, 0, 255)
          sk.fill(col, col, col)

          sk.noStroke()
          sk.fill(col, 0, 0)
          sk.ellipse(x, y, w, w)
        }
        time++
      }

      sk.windowResized = () => {
        width = window.innerWidth
        height = window.innerHeight - 70
        sk.redraw()
      }
    }
  }
}
</script>

<style scoped>

</style>
