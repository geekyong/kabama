import SimplePerception from '../Perception/SimplePerception'
import SimpleCharacter from './SimpleCharacter'

class Bloop extends SimpleCharacter {
  constructor (pInst, loc, dna, acceleration, targetSize) {
    super(pInst, loc, acceleration)
    this.dna = dna
    this.brain = new SimplePerception(this.p5, 10, 0.0001)
    this.maxSpeed = this.p5.map(this.dna.genes[0], 0, 1, 15, 0)

    this.r = this.p5.map(this.dna.genes[0], 0, 1, 0, 100)
    this.health = 100
    this.rawHealth = this.health
    this.damage = this.p5.map(this.r, 0, 100, 0, 1)
  }
  toString () {
    this.p5.print('sangji mantou')
  }

  run (bloops) {
    this.update(bloops)
    this.borders()
    this.display()
  }
  seek (target) {
    let desired = this.p5.sub(target, this.location)
    desired.normalize()
    desired.mult(this.p5.random(this.maxSpeed))
    let steer = this.p5.sub(desired, this.velocity)
    steer.limit(this.maxForce)
    return steer
  }

  steer (targets) {
    if (targets.length === 0 || !this.location.x) {
      return
    }

    let forces = []
    for (let target of targets) {
      forces.push(this.seek(target))
    }
    let result = this.brain.feedforward(forces)

    this.applyForce(result)
    // let tag = this.p5.createVector(this.p5.width / 2, this.p5.height / 2)
    let tag = this.p5.createVector(this.p5.mouseX, this.p5.mouseY)
    let error = this.p5.sub(tag, this.location)
    this.brain.train(forces, error)
  }
  update (bloops) {
    this.applyCollideDamage(bloops)
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxSpeed)
    this.location.add(this.velocity)
    this.acceleration.mult(0)
    this.health -= 0.2
  }
  borders () {
    this.location.x = this.p5.constrain(this.location.x, 0, this.p5.width)
    this.location.y = this.p5.constrain(this.location.y, 0, this.p5.height)
    if (this.location.x <= 0 || this.location.x >= this.p5.width) this.acceleration.x = -this.acceleration.x
    if (this.location.y === 0 || this.location.y >= this.p5.height) this.acceleration.y = -this.acceleration.y
  }
  healthBar () {
    let barWidth = 50
    const barHeight = 20
    barWidth = this.health / this.rawHealth * barWidth
    this.p5.push()
    this.p5.rectMode(this.p5.CENTER)
    let realColor = this.p5.lerpColor(this.p5.color('#f00'), this.p5.color('#0ee'), this.health / this.rawHealth)
    this.p5.fill(realColor)
    this.p5.translate(this.location.x, this.location.y - barHeight)
    this.p5.rect(0, 0, barWidth, barHeight)
    this.p5.pop()
  }

  display () {
    this.displayAvatar()
    this.healthBar()
  }
  dead () {
    return this.health < 0.0
  }
  eat (f) {
    let food = f.getFood()
    for (let i = food.length - 1; i >= 0; i--) {
      let singleFood = food[i]
      let hit = this.p5.collideCircleCircle(singleFood.location.x, singleFood.location.y, singleFood.r, this.location.x, this.location.y, this.r)
      if (hit) {
        this.health = this.p5.constrain(this.health + singleFood.recovery, 0, this.rawHealth)
        food.splice(i, 1)
      }
    }
  }
  reproduce () {
    if (this.p5.random(1) >= 0.001) {
      return null
    }
    let childDNA = this.dna.copy()
    childDNA.mutate(0.01)
    return new Bloop(this.p5, this.location.copy(), childDNA)
  }
}

export default Bloop
