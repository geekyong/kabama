import SingleFood from './SingleFood'

class Food {
  constructor (pInst, number) {
    this.p5 = pInst
    this.food = []
    this.r = 20
    for (let i = 0; i < number; i++) {
      this.food.push(
        new SingleFood(this.p5, this.p5.createVector(
          this.p5.random(this.p5.width),
          this.p5.random(this.p5.height)
        ), this.r)
      )
    }
  }

  add (l) {
    this.food.push(l)
  }
  run () {
    for (let i = 0; i < this.food.length; i++) {
      let f = this.food[i]
      f.display()
    }
    this.produce()
  }
  produce () {
    if (this.p5.random(1) < 0.001) {
      this.food.push(
        new SingleFood(this.p5, this.p5.createVector(
          this.p5.random(this.p5.width),
          this.p5.random(this.p5.height)
        ), this.r)
      )
    }
  }

  getFood () {
    return this.food
  }
}

export default Food
