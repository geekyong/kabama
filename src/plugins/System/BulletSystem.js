import SimpleCharacter from '../Character/SimpleCharacter'
export class Actor extends SimpleCharacter {
  constructor (pInst, loc, graphicsObject) {
    super(pInst, loc)
    // this.location = loc
    // this.xPosition = x
    // this.yPosition = y
    this.graphics = graphicsObject
    this.properFrameCount = 0
    this.rotationAngle = 0
    this.rotationVelocity = 0
  }

  act () {
    this.properFrameCount++
  }

  display () {
    this.graphics.display(this.location.x, this.location.y, this.rotationAngle)
  }
}
export class Bullet extends Actor {
  constructor (pInst, loc) {
    super(pInst, loc, null)
    this.allocatedIndicator = true
    this.belongingPool = null
    this.allocationIdentifier = 0

    this.directionAngle = 0.0
    this.speed = 0.0
    this.isDead = false
    this.health = 50
    this.damage = 0.3
  }

  isAllocated () {
    return this.allocatedIndicator
  }
  setAllocated (indicator) {
    this.allocatedIndicator = indicator
  }
  getBelongingPool () {
    return this.belongingPool
  }
  setBelongingPool (pool) {
    this.belongingPool = pool
  }
  getAllocationIdentifier () {
    return this.allocationIdentifier
  }
  setAllocationIdentifier (id) {
    this.allocationIdentifier = id
  }
  initialize () {
    this.graphics = null
    this.location.x = 0
    this.location.y = 0
    this.rotationAngle = 0
    this.rotationVelocity = 0
    this.properFrameCount = 0
    this.directionAngle = 0
    this.speed = 0
    this.isDead = false
  }

  act () {
    if (this.location.x < 0 || this.location.y > window.innerWidth || this.location.y < 0 || this.location.y > window.innerHeight - 70) {
      this.isDead = true
    }

    // Deceleration
    if (this.speed > 3 * 30) {
      this.speed -= (this.speed - 3 * 30) * 0.05
      if (this.speed < 3.1 * 30) this.speed = 3 * 30
    }

    this.location.x += this.speed * Math.cos(this.directionAngle)
    this.location.y += this.speed * Math.sin(this.directionAngle)
    this.rotationAngle += this.rotationVelocity
    super.act()
  }
}

export class Enemy extends Actor {
  constructor (pInst, loc, graphicsObject) {
    super(pInst, loc, graphicsObject)
    this.gunList = []
    this.actionList = []
    this.actionIndex = 0
    this.currentAction = null
    this.currentActionFrameCount = 0
    this.health = 200
    this.rawHealth = this.health
    this.step = 1
    this.acceleration = this.p5.createVector(-1, 0)
  }

  act () {
    this.calculateStep()
    this.rotationAngle += this.rotationVelocity

    this.actionList[this.actionIndex].execute(this)
    this.currentActionFrameCount++
    if (this.step === 1 && (this.actionIndex - 2) >= 0 && (this.actionIndex - 2) % 4 === 0) {
      this.firstStep()
    }

    if (this.step === 2) {
      this.secondStep()
    }
    if (this.currentActionFrameCount > this.currentAction.durationFrameCount) {
      this.actionIndex = (this.actionIndex + 1) % this.actionList.length
      this.currentAction = this.actionList[this.actionIndex]
      this.currentActionFrameCount = 0
    }

    super.act()
  }
  calculateStep () {
    this.step = this.health / this.rawHealth > 0.5 ? 1 : 2
  }
  secondStep () {

  }
  firstStep () {
    this.velocity.mult(0)
    this.acceleration.normalize()
    this.velocity.add(this.acceleration.mult(10))
    this.location.add(this.velocity)
    if (this.location.x < 0 || this.location.x > this.p5.width) {
      this.acceleration.mult(-1)
    }
  }
}

export class BulletSystem {
  constructor (pInst, bulletListInitialCapacity) {
    this.p5 = pInst
    this.bulletListInitialCapacity = bulletListInitialCapacity
    this.liveBulletList = []
    this.newBulletList = []
    this.deadBulletList = []
    this.currentEnemy = null

    this.gunList = []
  }

  update (bulletPool) {
    this.currentEnemy.act()
    for (let eachBullet of this.liveBulletList) {
      eachBullet.act()
    }
    for (let eachGun of this.gunList) {
      eachGun.act()
    }

    this.updateBulletList(bulletPool)
  }

  updateBulletList (bulletPool) {
    for (let i in this.liveBulletList) {
      if (this.liveBulletList[i].isDead) {
        this.deadBulletList.push(this.liveBulletList[i])
      }
    }
    if (this.deadBulletList.length > 0) {
      const tempDead = [...this.deadBulletList]
      for (let i in this.deadBulletList) {
        bulletPool.deallocate(tempDead[i])
        this.liveBulletList.splice(this.liveBulletList.indexOf(this.deadBulletList[i]), 1)
      }
      this.deadBulletList = []
    }
    if (this.newBulletList.length > 0) {
      for (let eachInstance of this.newBulletList) {
        this.liveBulletList.push(eachInstance)
      }
      this.newBulletList = []
    }
  }

  display () {
    this.p5.imageMode(this.p5.CENTER)
    for (let eachBullet of this.liveBulletList) {
      eachBullet.display()
    }
    for (let eachGun of this.gunList) {
      eachGun.display()
    }
    this.currentEnemy.display()
  }
}
