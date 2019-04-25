class UserInterface {
  constructor (pInst) {
    this.p5 = pInst
    this.heroHealthPercent = 1
    this.EnemyHealthPercent = 1
    this.barHeight = this.p5.height / 25
    this.lifeNumber = 3
  }
  update (heroPercent, EnemyPercent, lifeNumber) {
    this.lifeNumber = lifeNumber || this.lifeNumber
    this.heroHealthPercent = heroPercent || 1
    this.heroHealthPercent = this.p5.constrain(this.heroHealthPercent, 0, 1)
    this.EnemyHealthPercent = EnemyPercent || 1
    this.EnemyHealthPercent = this.p5.constrain(this.EnemyHealthPercent, 0, 1)
  }
  display (heartAvatar) {
    this.p5.rectMode(this.p5.CORNER)

    // Enemy Health Bar
    this.p5.push()
    this.p5.translate(this.p5.width / 3, this.p5.height * 0.01)
    this.p5.fill(this.p5.color(255, 0, 0, 40))
    this.p5.rect(0, 0, this.EnemyHealthPercent * this.p5.width / 3, this.barHeight)
    this.p5.textAlign(this.p5.CENTER)
    this.p5.textSize(32)
    this.p5.text(`${this.p5.int(this.EnemyHealthPercent * 100)}%`, this.p5.width / 6, this.barHeight + 10)

    this.p5.noFill()

    this.p5.stroke('#f00')
    this.p5.rect(0, 0, this.p5.width / 3, this.barHeight)
    this.p5.pop()
    // Hero Health Bar

    this.p5.push()
    this.p5.translate(this.p5.width / 20, this.p5.height * 0.95)
    this.p5.fill(this.p5.color(0, 0, 255, 40))
    this.p5.rect(0, 0, this.heroHealthPercent * this.p5.width / 4, this.barHeight)
    this.p5.noFill()
    this.p5.stroke('#00f')
    this.p5.rect(0, 0, this.p5.width / 4, this.barHeight)
    this.p5.pop()

    // LifeNumber
    this.p5.push()
    this.p5.translate(this.p5.width / 10, this.p5.height * 0.95)
    for (let i = 0; i < this.lifeNumber; i++) {
      this.p5.image(heartAvatar, i * 36, 0)
    }
    this.p5.pop()
  }
}
export default UserInterface
