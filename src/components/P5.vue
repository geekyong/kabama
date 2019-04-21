<template>
    <div />
</template>

<script>
import Plugin from '../plugins/p5.plugin'
import Anima from '../plugins/processing/p5.animation'
import Scribble from '../plugins/processing/p5.scribble'
export default {
  name: 'P5',
  mounted () {
    const eventNames = {
      preload: 'preload',
      setup: 'setup',
      draw: 'draw',

      keyPressed: 'keypressed',
      keyReleased: 'keyreleased',
      keyTyped: 'keytyped',

      mouseMoved: 'mousemoved',
      mouseDragged: 'mousedragged',
      mousePressed: 'mousepressed',
      mouseReleased: 'mousereleased',
      mouseClicked: 'mouseclicked',
      doubleClicked: 'doubleclicked',
      mouseWheel: 'mousewheel',

      touchStarted: 'touchstarted',
      touchMoved: 'touchmoved',
      touchEnded: 'touchended',

      deviceMoved: 'devicemoved',
      deviceTurned: 'deviceturned',
      deviceShaken: 'deviceshaken'
    }

    new Plugin(sketch => {
      const anima = new Anima(sketch)
      const scribble = new Scribble(sketch)
      sketch.anima = anima
      sketch.scribble = scribble
      this.$emit('sketch', sketch)

      for (let p5EventName in eventNames) {
        const vueEventName = eventNames[p5EventName]
        const savedCallback = sketch[p5EventName]

        sketch[p5EventName] = (...args) => {
          if (savedCallback) {
            savedCallback(sketch, ...args)
          }
          this.$emit(vueEventName, sketch, ...args)
        }
      }
    }, this.$el).start()
  }
}
</script>

<style scoped>

</style>
