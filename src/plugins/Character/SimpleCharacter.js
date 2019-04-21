class SimpleCharacter {
  constructor (pInst, loc, acceleration) {
    this.p5 = pInst
    this.location = loc
    this.acceleration = acceleration || this.p5.createVector(0, 0)
    this.velocity = this.p5.createVector(0, 0)
    this.maxForce = 1
    this.health = 100
    this.r = this.p5.random(0, 100)
    this.damage = this.p5.map(this.r, 0, 100, 0, 1)
  }

  toString () {

  }
  run () {

  }

  applyForce (force) {
    this.acceleration.add(force)
  }
  applyCollideDamage (object) {
    if (object && object.length > 0) {
      for (let obj of object) {
        let hit = this.p5.collideCircleCircle(obj.location.x, obj.location.y, obj.r, this.location.x, this.location.y, this.r)
        if (hit) {
          this.health -= obj.damage

          let b2m = this.p5.sub(this.location, obj.location)
          b2m.mult(obj.r)
          b2m.div(this.r)
          this.applyForce(b2m)
        }
      }
    }
  }

  update () {

  }
  display () {

  }
  displayAvatar (avatar) {
    if (!avatar) {
      this.p5.ellipseMode(this.p5.CENTER)
      this.p5.stroke(0, this.health)
      this.p5.fill(this.health)

      this.p5.ellipse(this.location.x, this.location.y, this.r, this.r)
    } else {

    }
  }
}
export default SimpleCharacter
