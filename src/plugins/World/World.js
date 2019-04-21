import Food from '../Character/Food'
import Bloop from '../Character/Bloop'
import DNA from '../Generation/DNA'
import SingleFood from '../Character/SingleFood'

class World {
  constructor (pInst, number) {
    this.p5 = pInst
    this.food = new Food(this.p5, number)
    this.bloops = []
    this.init(number)
  }
  init (number) {
    for (let i = 0; i < number; i++) {
      let loc = this.p5.createVector(this.p5.random(this.p5.width), this.p5.random(this.p5.height))
      let dna = new DNA(this.p5)
      this.bloops.push(new Bloop(this.p5, loc, dna))
    }
  }

  born (x, y, acceleration) {
    const loc = this.p5.createVector(x, y)
    const dna = new DNA(this.p5)
    this.bloops.push(new Bloop(this.p5, loc, dna, acceleration))
  }
  run () {
    this.food.run()
    let locs = []
    for (let i = 0; i < this.food.food.length; i++) {
      locs.push(this.food.food[i].location)
    }
    for (let i = this.bloops.length - 1; i >= 0; i--) {
      let tail = this.bloops[i]

      tail.steer(locs)

      tail.run(this.bloops)

      // tail.eat(this.food)

      let child = this.bloops[i].reproduce()
      if (child !== null) this.bloops.push(child)

      if (tail.dead()) {
        this.food.add(
          new SingleFood(this.p5,
            this.bloops[i].location,
            this.p5.random(8)
          )
        )
        this.bloops.splice(i, 1)
      }
    }
  }
}

export default World
