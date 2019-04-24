class EndPage {
  constructor (pInst) {
    this.p5 = pInst
    this.pg = this.p5.createGraphics(this.p5.width, this.p5.height)
  }

  display (myFont) {
    this.pg.background(this.p5.color(127, 127, 127, 0.9))
    this.pg.textAlign(this.p5.CENTER)
    this.pg.textSize(300)
    this.pg.textFont(myFont)
    this.pg.fill('#f00')
    this.pg.text('菜\n', this.p5.width / 2, this.p5.height / 2)
    this.p5.imageMode(this.p5.CORNER)
    this.p5.image(this.pg, 0, 0)
  }
}

export default EndPage
