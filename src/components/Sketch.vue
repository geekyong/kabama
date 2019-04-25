<template>
  <div>
    <v-p5 @sketch="sketch" />
  </div>
</template>

<script>
import { createColorFieldGraphics, ColorFieldParticleGraphics } from '../plugins/Object/Graphics'
import { Bullet, BulletSystem, Actor, Enemy } from '../plugins/System/BulletSystem'
import UserInterface from '../plugins/System/UserInterface'
import EndPage from '../plugins/System/EndPage'
import { ObjectPool } from '../plugins/Object/ObjectPool'
import GravityWellPoints from '../plugins/System/GravityWellPoint'
import {
  WaitAction,
  HoldGunsAction,
  LinearFireAction,
  SimpleFireAction,
  AroundDeployGunsAction,
  SpiralFireAction,
  FrontDeployGunsAction,
  ComplexFireAction
} from '../plugins/Object/Actions'
import { Defendence } from '../plugins/Object/Defendence'
import Hero from '../plugins/Character/Hero'
import KaiTi from '../assets/font/STXINGKA.ttf'
import Kabama from '../assets/Macaroon.png'
import Doughnut from '../assets/Doughnut.png'
import Bread from '../assets/Bread.png'
import Kokoro from '../assets/kokoro.png'
import Drone from '../assets/drone.png'
import Bull from '../assets/bullet.png'
import Go from '../assets/GO.png'
import JAVA from '../assets/java.png'
export default {
  name: 'Sketch',
  data: () => ({
    sourceC: ' function(){\n' +
      '      console.log(\'fuck me\')\n' +
      '      }'
  }),
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
      const UNIT_ANGLE_SPEED = sk.TWO_PI / 30
      const bulletSize = 12
      const bulletType = []
      const UNIT_SPEED = 10
      const WELLS_NUMBER = 24
      let width = window.innerWidth
      let height = window.innerHeight - 70
      let backgroundGraphics, bulletPool, mySystem, ui, endPage
      let isRestartable = false
      let kbm, dnd, brd, myFont, kokoro, drone, go, bull, ja
      let bulletIterator, defendence
      sk.preload = () => {
        kbm = sk.loadImage(Kabama)
        dnd = sk.loadImage(Doughnut)
        brd = sk.loadImage(Bread)
        kokoro = sk.loadImage(Kokoro)
        drone = sk.loadImage(Drone)
        go = sk.loadImage(Go)
        ja = sk.loadImage(JAVA)
        bull = sk.loadImage(Bull)
        myFont = sk.loadFont(KaiTi)
        bulletType.push(kbm)
        bulletType.push(dnd)
        bulletType.push(brd)

        bulletIterator = bulletType[Symbol.iterator]()
      }

      sk.setup = () => {
        sk.createCanvas(width, height)
        sk.frameRate(30)
        endPage = new EndPage(sk)
        ui = new UserInterface(sk)
        defendence = new Defendence(sk)
        backgroundGraphics = createColorFieldGraphics(sk, width, height, sk.color(255), 100, 10)
        bulletPool = initializeBullet(2048)
        mySystem = new BulletSystem(sk, 2048)
        prepareBulletHellSampleData(mySystem, bulletIterator, bulletSize)
        mySystem.currentEnemy.location.x = width * 0.5
        mySystem.currentEnemy.location.y = height * 0.15
      }

      sk.draw = () => {
        if (mySystem.currentEnemy.isDead()) {
          this.isOver = true
          this.$router.push('/over')
          return
        }
        // 玩家控制角色死亡
        if (mySystem.Hero.isDead()) {
          endPage.display(myFont)
          if (sk.keyIsPressed && isRestartable) {
            mySystem.Hero.initialize()
            mySystem.Hero.reduceLifeNumber()
            isRestartable = false
          }
          // 影逝二度
          if (mySystem.Hero.isRealDead()) {
            this.isOver = true
            this.$router.push('/over')
            return
          }
          return
        }

        sk.imageMode(sk.CORNER)
        sk.image(backgroundGraphics, 0, 0)

        mySystem.update(bulletPool)
        mySystem.display()

        ui.update(mySystem.Hero.health / mySystem.Hero.rawHealth, mySystem.currentEnemy.health / mySystem.currentEnemy.rawHealth, mySystem.Hero.lifeNumber)
        ui.display(kokoro)

        if ((mySystem.Hero.health / mySystem.Hero.rawHealth) < 0.2) {
          defendence.run(mySystem.Hero.location)
          if (defendence.frozenTime === 0) {
            mySystem.Hero.isProtected = true
          } else {
            mySystem.Hero.isProtected = false
          }
        } else {
          mySystem.Hero.isProtected = false
          defendence.initialize()
        }
      }

      sk.windowResized = () => {
        width = window.innerWidth
        height = window.innerHeight - 70

        sk.setup()
      }

      sk.keyPressed = () => {
        if (sk.keyCode === 82) {
          isRestartable = true
        }
      }

      class Gun extends Actor {
        constructor (pInst, loc, graphicsObject) {
          super(pInst, loc, graphicsObject)
          this.baseMuzzleDirectionAngle = Math.PI / 2
          this.baseMuzzleSpeed = 10
          this.firingBulletGraphics = null
        }

        act () {
          this.rotationAngle += this.rotationVelocity
        }

        fire (offsetMuzzleDirectionAngle, speedFactor, type) {
          let offsetAngle = !offsetMuzzleDirectionAngle ? 0 : offsetMuzzleDirectionAngle
          let speed = !speedFactor ? 1 : speedFactor
          let newBullet = bulletPool.allocate()
          if (newBullet === null) {
            return
          }

          if (type) {
            newBullet.type = type
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
          bulletPool.storeObject(new Bullet(sk, sk.createVector(0, 0)))
        }
        return bulletPool
      }

      function prepareBulletHellSampleData (system, bulletIt, bulletSize) {
        // Define enemy
        let enemyGraphics = new ColorFieldParticleGraphics(sk, 64, 64, 6, sk.color('#273244'), 8, 90, go) // dark gray
        let myEnemy = new Enemy(sk, sk.createVector(width * 0.5, height * 0.15), enemyGraphics)

        let heroGraphics = new ColorFieldParticleGraphics(sk, 32, 32, 6, sk.color('#0ff'), 8, 90, ja)
        let hero = new Hero(sk, sk.createVector(width * 0.5, height * 0.75), null, UNIT_SPEED)

        myEnemy.rotationVelocity = 0.1 * sk.TWO_PI / 30
        system.currentEnemy = myEnemy
        system.Hero = hero

        // Define enemy actionssa
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

        hero.currentAction = initialAction
        hero.actionList.push(new SimpleFireAction())

        // Define enemy guns
        // Colors picked from:  https://www.pinterest.jp/pin/305400418459473335/
        let gunGraphics = new ColorFieldParticleGraphics(sk, 12, 12, 6, sk.color('#b8b1a8'), 7, 70, drone) // gray
        let bulletGraphicsArray = new Array(3)
        bulletGraphicsArray[0] = new ColorFieldParticleGraphics(sk, bulletSize, bulletSize, 4, sk.color('#263de2'), 3, 50, bulletIt.next().value) // blue
        bulletGraphicsArray[1] = new ColorFieldParticleGraphics(sk, bulletSize, bulletSize, 4, sk.color('#b00101'), 3, 50, bulletIt.next().value) // red
        bulletGraphicsArray[2] = new ColorFieldParticleGraphics(sk, bulletSize, bulletSize, 4, sk.color('#d2a908'), 3, 50, bulletIt.next().value) // yellow

        let heroGun = new Gun(sk, hero.location, heroGraphics)
        heroGun.firingBulletGraphics = new ColorFieldParticleGraphics(sk, bulletSize, bulletSize, 4, sk.color('#263de2'), 3, 50, bull)
        // heroGun.rotationVelocity = 0.1 * UNIT_ANGLE_SPEED
        heroGun.location.x = hero.location.x
        heroGun.location.y = hero.location.y

        system.gunList.push(heroGun)
        hero.gunList.push(heroGun)

        for (let i = 0; i < 5; i++) {
          let newGun = new Gun(sk, sk.createVector(myEnemy.location.x, myEnemy.location.y), gunGraphics)
          newGun.firingBulletGraphics = bulletGraphicsArray[i % 3]
          newGun.rotationVelocity = 0.1 * UNIT_ANGLE_SPEED
          newGun.location.x = myEnemy.location.x
          newGun.location.y = myEnemy.location.y
          system.gunList.push(newGun)
          myEnemy.gunList.push(newGun)
        }

        for (let i = 0; i < WELLS_NUMBER; i++) {
          system.gravityWells.push(new GravityWellPoints(sk, sk.createVector(sk.random(width), sk.random(height))))
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
