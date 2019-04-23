class ParicleGraphics {
  display (xPosition, yPosition, rotationAngle) {

  }
}

export class ColorFieldParticleGraphics extends ParicleGraphics {
  constructor (pInst, xSize, ySize, radius, col, brushWeight, paintRepetitionCount, avatar) {
    super()
    this.p5 = pInst
    this.particleGraphics = avatar || createColorFieldGraphics(pInst, xSize, ySize, col, brushWeight, paintRepetitionCount)
    this.graphicsXSize = xSize
    this.graphicsYSize = ySize
    this.graphicsRadius = radius
  }

  display (xPosition, yPosition, rotationAngle) {
    this.p5.noStroke()
    this.p5.fill(64, 32)
    this.p5.rectMode(this.p5.CENTER)

    this.p5.push()
    this.p5.translate(xPosition + 2, yPosition + 4)
    this.p5.push()
    this.p5.rotate(rotationAngle)
    this.p5.rect(0, 0, this.graphicsXSize, this.graphicsYSize, this.graphicsRadius)
    this.p5.pop()
    this.p5.translate(-2, -4)
    this.p5.rotate(rotationAngle)
    this.p5.image(this.particleGraphics, 0, 0)
    this.p5.pop()
  }
}

export function createColorFieldGraphics (pInst, xSize, ySize, col, brushWeight, paintRepetitionCount) {
  let graphics = pInst.createGraphics(xSize, ySize)
  graphics.colorMode(pInst.HSB, 360, 100, 100, 100)
  graphics.background(0, 0, 100)
  graphics.fill(col, 20)
  graphics.noStroke()
  graphics.rect(0, 0, graphics.width, graphics.height)
  graphics.strokeWeight(brushWeight)

  for (let i = 0; i < paintRepetitionCount; i++) {
    graphics.stroke(col, 10)
    let w = pInst.random(xSize * 0.1, xSize * 0.5)
    let x = pInst.random(0, graphics.width)
    let y = pInst.random(-brushWeight, graphics.height + brushWeight)
    graphics.line(x - w * 0.5, y, x + w * 0.5, y)
  }
  for (let i = 0; i < paintRepetitionCount; i++) {
    graphics.stroke(col, 10)
    let h = pInst.random(ySize * 0.1, ySize * 0.5)
    let x = pInst.random(-brushWeight, graphics.width + brushWeight)
    let y = pInst.random(0, graphics.height)
    graphics.line(x, y - h * 0.5, x, y + h * 0.5)
  }
  return graphics
}
