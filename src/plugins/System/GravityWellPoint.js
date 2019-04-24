import SimpleCharacter from '../Character/SimpleCharacter'
import DNA from '../Generation/DNA'
import { ColorFieldParticleGraphics } from '../Object/Graphics'

class GravityWellPoint extends SimpleCharacter {
  constructor (pInst, loc) {
    super(pInst, loc)
    this.dna = new DNA(pInst)
    this.health = this.p5.map(this.dna.genes[0], 0, 1, 0, 100)
    this.rawHealth = this.health
    this.r = this.health
    this.rawRadius = this.r
    this.c = 0.1
    this.gravity = this.health * this.c
    this.graphic = new ColorFieldParticleGraphics(pInst, this.r, this.r, 4, this.p5.color(127, 127, 127, 0.9), 3, 50)
  }
  run () {
    this.update()
    this.display()
  }

  display () {
    this.graphic.display(this.location.x, this.location.y, this.p5.radians((this.p5.frameCount % 30) % 360))
    // this.p5.ellipse(this.location.x, this.location.y, this.r, this.r)
  }
  update () {
    this.health = this.p5.constrain(this.health - 1, 0, this.rawHealth)
    this.r = this.health
    this.gravity = this.health * this.c

    this.graphic.graphicsXSize = this.graphic.graphicsYSize = this.r
  }

  isDead () {
    return this.health <= 0
  }

  reproduce () {
    if (this.p5.random(1) >= 0.001) {
      return null
    }
    let childDNA = this.dna.copy()
    return new GravityWellPoint(this.p5, this.p5.createVector(this.p5.random(this.p5.width, this.p5.height)), childDNA)
  }
}

export default GravityWellPoint
