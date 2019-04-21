class SimplePerception {
  constructor (pInst, n, c_) {
    this.p5 = pInst
    this.weights = []
    this.c = c_
    for (let i = 0; i < n; i++) {
      this.weights.push(this.p5.random(0, 1))
    }
  }

  train (forces, error) {
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] += this.c * error.x * forces[i].x
      this.weights[i] += this.c * error.y * forces[i].y
      this.weights[i] = this.p5.constrain(this.weights[i], 0, 1)
    }
  }

  feedforward (forces) {
    // Sum all values
    let sum = this.p5.createVector(0, 0)
    for (let i = 0; i < this.weights.length; i++) {
      forces[i].mult(this.weights[i])
      sum.add(forces[i])
    }
    return sum
  }
}
export default SimplePerception
