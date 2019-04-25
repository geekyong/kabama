<template>
    <v-p5 @sketch="sketch" v-show="isOver"></v-p5>
</template>

<script>
import KaiTi from '../assets/font/STXINGKA.ttf'
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
    sketch (sk) {
      let width = window.innerWidth
      let height = window.innerHeight - 70
      let textFont

      let time = 0
      sk.preload = () => {
        textFont = sk.loadFont(KaiTi)
      }
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

        // sk.translate(width * 0.5, height * 0.15)
        sk.stroke('#000')
        sk.scribble.scribbleRect(sk.width / 2, sk.height * 0.15, width / 3, height / 20)
        sk.push()
        sk.translate(sk.width / 2, sk.height * 0.15)
        sk.fill('#000')
        sk.noStroke()
        sk.textFont(textFont)
        sk.textAlign(sk.CENTER)
        sk.textSize(24)
        sk.text('点击重新开始\n', 0, 0)
        sk.pop()

        for (let i = 0; i < 360; i += 3) {
          let x = sk.cos(sk.radians(i)) * 50 + width / 2
          let y = sk.sin(sk.radians(i)) * 100 + height * 0.6
          let w = sk.sin(sk.radians(time + i)) * 200
          w = sk.abs(w)

          let col = sk.map(i, 0, 360, 0, 255)
          sk.fill(col, col, col)

          sk.noStroke()
          sk.fill(0, col, col)
          sk.ellipse(x, y, w, w)
        }
        time++
      }

      sk.keyPressed = () => {
        if (sk.keyCode === 82) {
          this.isOver = false
          this.$router.push('/')
        }
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
