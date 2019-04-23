import SimpleCharacter from './SimpleCharacter'

class Hero extends SimpleCharacter {
  constructor (pInst, loc, acceleration, speed) {
    super(pInst, loc, acceleration)
    this.speed = speed
  }
  applyCollideDamage (object) {

  }

  sustainCollideDamage (objects) {
    for (let obj of objects) {
      const hit = this.p5.collideCircleCircle(obj.location.x, obj.location.y, this.location.x, this.location.y)

      if (hit) {
        this.health -= obj.damage
      }
    }
  }
  update () {
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

    this.velocity.add(this.acceleration.mult(this.speed))
    this.location.add(this.velocity)
    this.borders()
  }
  display () {
    this.p5.stroke('#00f')
    this.p5.rectMode(this.p5.CENTER)
    this.p5.scribble.scribbleRect(this.location.x, this.location.y, 30, 30)
  }

  isDead () {
    return this.health <= 0
  }
}
export default Hero
