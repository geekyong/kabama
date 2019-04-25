import SimpleCharacter from './SimpleCharacter'

class Hero extends SimpleCharacter {
  constructor (pInst, loc, acceleration, speed) {
    super(pInst, loc, acceleration)
    this.speed = speed
    this.r = 25
    this.health = 100
    this.rawHealth = this.health
    this.undeadCount = 0
    this.lifeNumber = 2
    this.currentAction = null
    this.currentActionFrameCount = 0
    this.actionIndex = 0
    this.actionList = []
    this.gunList = []
    this.isProtected = false
  }

  act () {
    this.currentActionFrameCount++
    this.actionList[this.actionIndex].execute(this)

    if (this.currentActionFrameCount > this.currentAction.durationFrameCount) {
      this.actionIndex = (this.actionIndex + 1) % this.actionList.length
      this.currentAction = this.actionList[this.actionIndex]
      this.currentActionFrameCount = 0
    }

    this.properFrameCount++
  }

  applyCollideDamage (object) {

  }

  initialize () {
    this.health = this.rawHealth
    this.location = this.p5.createVector(this.p5.width / 2, this.p5.height * 0.8)
    this.undeadCount += 1
    let interval = setInterval(() => {
      this.undeadCount += 1
      if (this.undeadCount > 3) {
        this.undeadCount = 0
        clearInterval(interval)
      }
    }, 1000)
  }

  reduceLifeNumber () {
    this.lifeNumber--
  }
  sustainCollideDamage (objects) {
    if (this.undeadCount > 0) {
      return
    }
    for (let obj of objects) {
      if (obj.type === 'hero') continue

      const hit = this.p5.collideCircleCircle(obj.location.x, obj.location.y, 16, this.location.x, this.location.y, this.r)

      if (hit) {
        this.health = this.p5.constrain(this.health - obj.damage, 0, this.rawHealth)
      }
    }
  }
  seek (target) {
    let desired = this.p5.sub(target.location, this.location)
    desired.normalize()
    desired.mult(target.gravity * 0.01)
    return desired
  }

  steer (targets) {
    if (targets.length === 0) {
      return
    }

    let forces = this.p5.createVector()
    for (let target of targets) {
      forces.add(this.seek(target))
    }
    this.health = this.p5.constrain(this.health - forces.normalize().magSq() * 0.1, 0, this.rawHealth)

    this.applyForce(forces)
  }
  update (targets, step) {
    this.velocity.mult(0)
    this.acceleration.mult(0)
    if (this.p5.keyIsDown(87)) {
      this.applyForce(this.p5.createVector(0, -1))
    }
    if (this.p5.keyIsDown(83)) {
      this.applyForce(this.p5.createVector(0, 1))
    }
    if (this.p5.keyIsDown(65)) {
      this.applyForce(this.p5.createVector(-1, 0))
    }
    if (this.p5.keyIsDown(68)) {
      this.applyForce(this.p5.createVector(1, 0))
    }
    if (targets && step === 2) {
      this.steer(targets)
    }
    this.velocity.add(this.acceleration.mult(this.speed))
    this.location.add(this.velocity)
    this.borders()
  }
  display () {
    if (this.isDead()) return
    this.p5.stroke('#00f')
    this.p5.rectMode(this.p5.CENTER)
    this.p5.scribble.scribbleRect(this.location.x, this.location.y, this.r, this.r)
  }

  isDead () {
    return this.health <= 0
  }

  isRealDead () {
    return this.lifeNumber <= 0
  }
}
export default Hero
