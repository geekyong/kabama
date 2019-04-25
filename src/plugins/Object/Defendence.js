export class Defendence {
  constructor (pInst) {
    this.p5 = pInst
    this.countNumber = 5
    this.frozenNumber = 5
    this.timeCount = this.countNumber
    this.frozenTime = 0
  }
  run (loc) {
    this.location = loc
    this.update()
    this.display()
  }
  initialize () {
    this.timeCount = this.countNumber
    this.frozenTime = 0
  }

  update () {
    if (this.p5.frameCount % 30 < 1) {
      console.log('timeCount: ' + this.timeCount)
      console.log('frozenTime: ' + this.frozenTime)

      if (this.timeCount <= 0) {
        if (this.frozenTime >= this.frozenNumber) {
          this.timeCount = this.countNumber
          this.frozenTime = 0
        }
        this.frozenTime++
        return
      }
      this.timeCount--
    }
  }
  display () {
    if (this.frozenTime === 0) {
      this.p5.push()
      this.p5.stroke(127)
      this.p5.strokeWeight(10)
      this.p5.scribble.scribbleRect(this.location.x, this.location.y, 200, 200)
      this.p5.pop()
    }
  }
}
