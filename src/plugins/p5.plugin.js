import Collide from './processing/p5.collide'
import Base from './processing/p5.base'

class Plugin extends Collide(Base) {
  constructor (sketch, $el) {
    super(sketch, $el)
    this.sit = 'start'
  }

  start () {

  }
}

export default Plugin
