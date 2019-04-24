import SimpleCharacter from '../Character/SimpleCharacter'
import SimplePerception from '../Perception/SimplePerception'
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
    this.type = null
    this.damage = 3
    this.maxSpeed = 10
    this.brain = new SimplePerception(pInst, 24, 0.0001)
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

  seek (target) {
    let desired = this.p5.sub(target.location, this.location)
    desired.normalize()
    desired.mult(target.gravity)
    let steer = this.p5.sub(desired, this.velocity)
    steer.limit(this.maxForce)
    return steer
  }

  steer (targets, heroLocation) {
    if (targets.length === 0) {
      return
    }

    let forces = []
    for (let target of targets) {
      forces.push(this.seek(target))
    }
    let result = this.brain.feedforward(forces)

    this.applyForce(result)
    // let tag = this.p5.createVector(this.p5.width / 2, this.p5.height / 2)
    let tag = this.p5.createVector(heroLocation.x || 0, heroLocation.y || 0)
    let error = this.p5.sub(tag, this.location)
    this.brain.train(forces, error)
  }

  update () {
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxSpeed)
    this.location.add(this.velocity)
    // this.acceleration.mult(0)
  }
  act (step, points, heroLocation) {
    if (this.location.x < 0 || this.location.y > window.innerWidth || this.location.y < 0 || this.location.y > window.innerHeight - 70) {
      this.isDead = true
    }
    // Deceleration
    if (this.speed > 3 * 30) {
      this.speed -= (this.speed - 3 * 30) * 0.05
      if (this.speed < 3.1 * 30) this.speed = 3 * 30
    }

    if (step === 1 && !this.type) {
      this.location.x += this.speed * Math.cos(this.directionAngle)
      this.location.y += this.speed * Math.sin(this.directionAngle)
      this.rotationAngle += this.rotationVelocity
    } else if (step === 2 && !this.type) {
      this.steer(points, heroLocation)
      this.update()
    } else if (this.type === 'hero') {
      this.location.x += this.speed * Math.cos(this.directionAngle)
      this.location.y += this.speed * Math.sin(this.directionAngle)
    }
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

  act (heroLocation) {
    this.calculateStep()
    this.rotationAngle += this.rotationVelocity

    this.actionList[this.actionIndex].execute(this)
    this.currentActionFrameCount++
    if (this.step === 1 && (this.actionIndex - 2) >= 0 && (this.actionIndex - 2) % 4 === 0) {
      this.firstStep()
    }

    if (this.step === 2) {
      this.secondStep(heroLocation)
    }
    if (this.currentActionFrameCount > this.currentAction.durationFrameCount) {
      this.actionIndex = (this.actionIndex + 1) % this.actionList.length
      this.currentAction = this.actionList[this.actionIndex]
      this.currentActionFrameCount = 0
    }

    super.act()
  }
  sustainCollideDamage (objects) {
    for (let obj of objects) {
      if (obj.type !== 'hero') continue
      const hit = this.p5.collideCircleCircle(obj.location.x, obj.location.y, 16, this.location.x, this.location.y, this.r)

      if (hit) {
        this.health = this.p5.constrain(this.health - obj.damage, 0, this.rawHealth)
      }
    }
  }
  calculateStep () {
    this.step = this.health / this.rawHealth > 0.5 ? 1 : 2
  }
  secondStep (heroLocation) {
    this.location.x = heroLocation.x
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
    this.Hero = null

    this.gravityWells = []
    this.gunList = []
    this.points = []
    this.heroLocation = this.p5.createVector()
  }

  updateGravityWellPoints () {
    this.points = this.gravityWells
    this.heroLocation = this.Hero.location
  }

  update (bulletPool) {
    // 进入二阶段更新重力井位置
    if (this.currentEnemy.step === 2 && this.gravityWells.length > 0) {
      for (let g = 0; g < this.gravityWells.length; g++) {
        if (this.gravityWells[g].isDead()) {
          let temp = this.gravityWells[g].reproduce()
          this.gravityWells[g] = temp
        }
        this.gravityWells[g].run()
      }
      this.updateGravityWellPoints()
    }

    // 更新敌方位置
    this.currentEnemy.act(this.heroLocation)

    this.Hero.act()

    for (let eachBullet of this.liveBulletList) {
      eachBullet.act(this.currentEnemy.step, this.points, this.heroLocation)
    }
    for (let eachGun of this.gunList) {
      eachGun.act()
    }

    this.updateBulletList(bulletPool)
    this.currentEnemy.sustainCollideDamage(this.liveBulletList)
    this.Hero.sustainCollideDamage(this.liveBulletList)
    this.Hero.update(this.gravityWells, this.currentEnemy.step)
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
    this.Hero.display()
  }
}
