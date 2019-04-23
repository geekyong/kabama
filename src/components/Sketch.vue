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
import {
  WaitAction,
  HoldGunsAction,
  LinearFireAction,
  AroundDeployGunsAction,
  SpiralFireAction,
  FrontDeployGunsAction,
  ComplexFireAction
} from '../plugins/Object/Actions'
import Hero from '../plugins/Character/Hero'

import Kabama from '../assets/Macaroon.png'
import Doughnut from '../assets/Doughnut.png'
import Bread from '../assets/Bread.png'
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
      const bulletSize = 12
      const bulletType = []
      const UNIT_SPEED = 8
      let width = window.innerWidth
      let height = window.innerHeight - 70
      let world, backgroundGraphics, bulletPool, mySystem
      let kbm, dnd, brd, hero
      let bulletIterator
      sk.preload = () => {
        kbm = sk.loadImage(Kabama)
        dnd = sk.loadImage(Doughnut)
        brd = sk.loadImage(Bread)
        bulletType.push(kbm)
        bulletType.push(dnd)
        bulletType.push(brd)

        bulletIterator = bulletType[Symbol.iterator]()
      }

      sk.setup = () => {
        sk.createCanvas(width, height)
        sk.frameRate(30)
        world = new World(sk, 10)
        hero = new Hero(sk, sk.createVector(width * 0.5, height * 0.75), null, UNIT_SPEED)
        backgroundGraphics = createColorFieldGraphics(sk, width, height, sk.color(232), 100, 10)
        bulletPool = initializeBullet(2048)
        mySystem = new BulletSystem(sk, 2048)
        prepareBulletHellSampleData(mySystem, bulletIterator, bulletSize)
      }

      sk.draw = () => {
        // sk.background('#fff')
        sk.imageMode(sk.CORNER)
        sk.image(backgroundGraphics, 0, 0)
        mySystem.currentEnemy.location.x = sk.mouseX
        mySystem.currentEnemy.location.y = sk.mouseY
        mySystem.update(bulletPool)
        mySystem.display()

        hero.update()
        hero.display()
        // bulletPool.update()
        // world.run()
        sk.stroke('#000')
        sk.scribble.scribbleRect(sk.mouseX, sk.mouseY, 200, 200)
      }

      sk.windowResized = () => {
        sk.setup()
      }

      class Gun extends Actor(Poolable) {
        constructor (loc, graphicsObject) {
          super(loc, graphicsObject)
          this.baseMuzzleDirectionAngle = Math.PI / 2
          this.baseMuzzleSpeed = 10
          this.firingBulletGraphics = null
        }

        act () {
          this.rotationAngle += this.rotationVelocity
        }

        fire (offsetMuzzleDirectionAngle, speedFactor) {
          let offsetAngle = !offsetMuzzleDirectionAngle ? 0 : offsetMuzzleDirectionAngle
          let speed = !speedFactor ? 1 : speedFactor
          let newBullet = bulletPool.allocate()
          if (newBullet === null) {
            return
          }
          newBullet.location.x = this.location.x
          newBullet.location.y = this.location.y
          newBullet.graphics = this.firingBulletGraphics
          newBullet.directionAngle = this.baseMuzzleDirectionAngle + offsetAngle
          newBullet.speed = this.baseMuzzleSpeed * speed
          newBullet.rotationVelocity = 0.5 * Math.PI * 2 / 30
          if (Math.random() < 0.5) newBullet.rotationVelocity = -newBullet.rotationVelocity
          mySystem.newBulletList.push(newBullet)
        }
      }

      function initializeBullet (poolSize) {
        let bulletPool = new ObjectPool(poolSize)
        for (let i = 0; i < bulletPool.poolSize; i++) {
          bulletPool.storeObject(new Bullet(sk.createVector(0, 0)))
        }
        return bulletPool
      }

      function prepareBulletHellSampleData (system, bulletIt, bulletSize) {
        // Define enemy
        let enemyGraphics = new ColorFieldParticleGraphics(sk, 32, 32, 6, sk.color('#273244'), 8, 90) // dark gray
        let myEnemy = new Enemy(sk.createVector(width * 0.5, height * 0.15), enemyGraphics)
        myEnemy.rotationVelocity = 0.1 * sk.TWO_PI / 30
        system.currentEnemy = myEnemy

        // Define enemy actions
        let initialAction = new WaitAction()
        myEnemy.currentAction = initialAction
        myEnemy.actionList.push(initialAction)

        myEnemy.actionList.push(new FrontDeployGunsAction())
        myEnemy.actionList.push(new LinearFireAction())
        myEnemy.actionList.push(new WaitAction())
        myEnemy.actionList.push(new HoldGunsAction())

        myEnemy.actionList.push(new AroundDeployGunsAction())
        myEnemy.actionList.push(new SpiralFireAction())
        myEnemy.actionList.push(new WaitAction())
        myEnemy.actionList.push(new HoldGunsAction())

        myEnemy.actionList.push(new AroundDeployGunsAction())
        myEnemy.actionList.push(new ComplexFireAction())
        myEnemy.actionList.push(new WaitAction())
        myEnemy.actionList.push(new HoldGunsAction())

        // Define enemy guns
        // Colors picked from:  https://www.pinterest.jp/pin/305400418459473335/
        let gunGraphics = new ColorFieldParticleGraphics(sk, 20, 20, 6, sk.color('#b8b1a8'), 7, 70) // gray
        let bulletGraphicsArray = new Array(3)
        bulletGraphicsArray[0] = new ColorFieldParticleGraphics(sk, bulletSize, bulletSize, 4, sk.color('#263de2'), 3, 50, bulletIt.next().value) // blue
        bulletGraphicsArray[1] = new ColorFieldParticleGraphics(sk, bulletSize, bulletSize, 4, sk.color('#b00101'), 3, 50, bulletIt.next().value) // red
        bulletGraphicsArray[2] = new ColorFieldParticleGraphics(sk, bulletSize, bulletSize, 4, sk.color('#d2a908'), 3, 50, bulletIt.next().value) // yellow
        for (let i = 0; i < 6; i++) {
          let newGun = new Gun(sk.createVector(0, 0), gunGraphics)
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
