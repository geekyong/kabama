class SingleFood {
  constructor (pInst, loc, r) {
    this.p5 = pInst
    this.location = loc
    this.r = r
    this.recovery = this.p5.random(this.r * 80)
  }
  display () {
    this.p5.rectMode(this.p5.CENTER)
    this.p5.stroke(0)
    this.p5.fill(175)
    this.p5.rect(this.location.x, this.location.y, this.r, this.r)
  }
}

export default SingleFood
