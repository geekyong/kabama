import SimpleCharacter from '../Character/SimpleCharacter'
import DNA from '../Generation/DNA'

class GravityWellPoint extends SimpleCharacter {
  constructor (pInst, loc, dna) {
    super(pInst, loc)
    this.dna = new DNA(pInst, dna)
    this.health = this.p5.map(this.dna.genes[0], 0, 1, 0, 500)
    this.rawHealth = this.health
    this.r = this.health
    this.rawRadius = this.r
    this.c = 0.1
    this.gravity = this.health * this.c
  }
  run () {
    this.update()
    this.display()
  }

  display () {
    this.p5.noStroke()
    this.p5.fill(this.p5.color(0, 0, 0, 100 * this.health / this.rawHealth))
    this.p5.ellipse(this.location.x, this.location.y, this.r, this.r)
  }
  update () {
    this.health = this.p5.constrain(this.health - 1, 0, this.rawHealth)
    this.r = this.health
    this.gravity = this.health * this.c
  }

  isDead () {
    return this.health <= 0
  }

  reproduce () {
    let childDNA = this.dna.copy()
    childDNA.mutate(0.01)
    return new GravityWellPoint(
      this.p5,
      this.p5.createVector(this.p5.random(this.p5.width), this.p5.random(this.p5.height)),
      childDNA.genes)
  }
}

export default GravityWellPoint
