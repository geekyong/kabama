import { Poolable } from '../Object/ObjectPool'
export const Actor = (extendClass) => class extends extendClass {
  constructor (x, y, graphicsObject) {
    super()
    this.xPosition = x
    this.yPosition = y
    this.graphics = graphicsObject
    this.properFrameCount = 0
    this.rotationAngle = 0
    this.rotationVelocity = 0
  }

  act () {
    this.properFrameCount++
  }

  display () {
    this.graphics.display(this.xPosition, this.yPosition, this.rotationAngle)
  }
}
export class Bullet extends Actor(Poolable) {
  constructor () {
    super(0, 0, null)
    this.allocatedIndicator = true
    this.belongingPool = null
    this.allocationIdentifier = 0

    this.directionAngle = 0.0
    this.speed = 0.0
    this.isDead = false
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
    this.xPosition = 0
    this.yPosition = 0
    this.rotationAngle = 0
    this.rotationVelocity = 0
    this.properFrameCount = 0
    this.directionAngle = 0
    this.speed = 0
  }

  act () {
    if (this.xPosition < 0 || this.xPosition > window.innerWidth || this.yPosition < 0 || this.yPosition > window.innerHeight - 70) {
      this.isDead = true
    }

    // Deceleration
    if (this.speed > 3 * 30) {
      this.speed -= (this.speed - 3 * 30) * 0.05
      if (this.speed < 3.1 * 30) this.speed = 3 * 30
    }

    this.xPosition += this.speed * Math.cos(this.directionAngle)
    this.yPosition += this.speed * Math.sin(this.directionAngle)
    this.rotationAngle += this.rotationVelocity
    super.act()
  }
}

export class Enemy extends Actor(Poolable) {
  constructor (x, y, graphicsObject) {
    super(x, y, graphicsObject)
    this.gunList = []
    this.actionList = []
    this.actionIndex = 0
    this.currentAction = null
    this.currentActionFrameCount = 0
  }

  act () {
    this.rotationAngle += this.rotationVelocity

    this.actionList[this.actionIndex].execute(this)
    this.currentActionFrameCount++
    if (this.currentActionFrameCount > this.currentAction.durationFrameCount) {
      this.actionIndex = (this.actionIndex + 1) % this.actionList.length
      this.currentAction = this.actionList[this.actionIndex]
      this.currentActionFrameCount = 0
    }

    super.act()
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
      for (let eachInstance of this.deadBulletList) {
        this.liveBulletList.splice(this.liveBulletList.indexOf(eachInstance), 1)
        // bulletPool.deallocate(eachInstance)
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
