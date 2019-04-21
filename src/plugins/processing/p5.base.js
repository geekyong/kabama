import P5 from 'p5/lib/p5.min'

class Base extends P5 {
  constructor (sketch, $el) {
    super(sketch, $el)
    this.debugWord = 'Start Doing'
  }
  Debug () {
    window.console.log(this.debugWord)
  }

  mult (v, n, target) {
    if (!target) {
      target = v.copy()
    } else {
      target.set(v)
    }
    target.mult(n)
    return target
  };
  dot (v1, v2) {
    return v1.dot(v2)
  };
  mag (vecT) {
    let x = vecT.x
    let y = vecT.y
    let z = vecT.z
    let magSq = x * x + y * y + z * z
    return Math.sqrt(magSq)
  }

  sub (v1, v2, target) {
    if (!target) {
      target = v1.copy()
    } else {
      target.set(v1)
    }
    target.sub(v2)
    return target
  }
}

export default Base
