<template>
  <div>
    <!--<pre v-highlightjs="sourceC">-->
      <!--<code class="javascript">-->
      <!--</code>-->
    <!--</pre>-->
    <v-p5 @sketch="sketch" />

  </div>
</template>

<script>
import World from '../plugins/World/World'
import { createColorFieldGraphics, ColorFieldParticleGraphics } from '../plugins/Object/Graphics'
import { Bullet, BulletSystem, Actor, Enemy } from '../plugins/System/BulletSystem'

import { ObjectPool, Poolable } from '../plugins/Object/ObjectPool'
import { WaitAction, HoldGunsAction, AroundDeployGunsAction, SpiralFireAction } from '../plugins/Object/Actions'

export default {
  name: 'Sketch',
  data: () => ({
    sourceC: ' function(){\n' +
      '      console.log(\'fuck me\')\n' +
      '      }'
  }),
  methods: {
    sketch (sk) {
      const UNIT_ANGLE_SPEED = sk.TWO_PI / 30
      let width = window.innerWidth
      let height = window.innerHeight - 70
      let world, backgroundGraphics, bulletPool, mySystem
      sk.setup = () => {
        sk.createCanvas(width, height)
        sk.frameRate(30)
        world = new World(sk, 10)
        backgroundGraphics = createColorFieldGraphics(sk, width, height, sk.color(232), 100, 10)
        bulletPool = initializeBullet(2048)
        mySystem = new BulletSystem(sk, 2048)
        prepareBulletHellSampleData(mySystem)
      }

      sk.draw = () => {
        // sk.background('#fff')
        sk.imageMode(sk.CORNER)
        sk.image(backgroundGraphics, 0, 0)
        mySystem.update(bulletPool)
        mySystem.display()

        bulletPool.update()
        // world.run()
        sk.stroke('#000')
        sk.scribble.scribbleRect(sk.mouseX, sk.mouseY, 200, 200)
      }

      sk.windowResized = () => {
        sk.setup()
      }

      class Gun extends Actor(Poolable) {
        constructor (graphicsObject) {
          super(0, 0, graphicsObject)
          this.baseMuzzleDirectionAngle = Math.PI / 2
          this.baseMuzzleSpeed = 10
          this.firingBulletGraphics = null
        }

        act () {
          this.rotationAngle += this.rotationVelocity
        }

        fire (offsetMuzzleDirectionAngle, speedFactor) {
          let offsetAngle = !offsetMuzzleDirectionAngle ? 0 : offsetMuzzleDirectionAngle
          let speed = !speedFactor ? 0 : speedFactor
          let newBullet = bulletPool.allocate()
          newBullet.xPosition = this.xPosition
          newBullet.yPosition = this.yPosition
          newBullet.graphics = this.firingBulletGraphics
          newBullet.directionAngle = this.baseMuzzleDirectionAngle + offsetAngle
          newBullet.speed = this.baseMuzzleSpeed * speed
          newBullet.rotationVelocity = 0.5 * sk.TWO_PI / 30
          if (sk.random(1) < 0.5) newBullet.rotationVelocity = -newBullet.rotationVelocity
          mySystem.newBulletList.push(newBullet)
        }
      }

      function initializeBullet (poolSize) {
        let bulletPool = new ObjectPool(poolSize)
        for (let i = 0; i < bulletPool.poolSize; i++) {
          bulletPool.storeObject(new Bullet())
        }
        return bulletPool
      }

      function prepareBulletHellSampleData (system) {
        // Define enemy
        let enemyGraphics = new ColorFieldParticleGraphics(sk, 32, 32, 6, sk.color('#273244'), 8, 90) // dark gray
        let myEnemy = new Enemy(width * 0.5, height * 0.15, enemyGraphics)
        myEnemy.rotationVelocity = 0.1 * sk.TWO_PI / 30
        system.currentEnemy = myEnemy

        // Define enemy actions
        let initialAction = new WaitAction()
        myEnemy.currentAction = initialAction
        myEnemy.actionList.push(initialAction)
        myEnemy.actionList.push(new AroundDeployGunsAction())
        myEnemy.actionList.push(new SpiralFireAction())
        myEnemy.actionList.push(new WaitAction())
        myEnemy.actionList.push(new HoldGunsAction())

        // Define enemy guns
        // Colors picked from:  https://www.pinterest.jp/pin/305400418459473335/
        let gunGraphics = new ColorFieldParticleGraphics(sk, 20, 20, 6, sk.color('#b8b1a8'), 7, 70) // gray
        let bulletGraphicsArray = new Array(3)
        bulletGraphicsArray[0] = new ColorFieldParticleGraphics(sk, 12, 12, 4, sk.color('#263de2'), 3, 50) // blue
        bulletGraphicsArray[1] = new ColorFieldParticleGraphics(sk, 12, 12, 4, sk.color('#b00101'), 3, 50) // red
        bulletGraphicsArray[2] = new ColorFieldParticleGraphics(sk, 12, 12, 4, sk.color('#d2a908'), 3, 50) // yellow
        for (let i = 0; i < 6; i++) {
          let newGun = new Gun(gunGraphics)
          newGun.firingBulletGraphics = bulletGraphicsArray[i % 3]
          newGun.rotationVelocity = 0.1 * UNIT_ANGLE_SPEED
          newGun.xPosition = myEnemy.xPosition
          newGun.yPosition = myEnemy.yPosition
          system.gunList.push(newGun)
          myEnemy.gunList.push(newGun)
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
