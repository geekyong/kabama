export class Action {
  constructor (duraiotnSecond) {
    this.durationFrameCount = duraiotnSecond * 30 || 2 * 30
  }
  execute (parentEnemy) {

  };

  controlAllGuns (parentEnemy) {
    for (let gunIndex = 0; gunIndex < parentEnemy.gunList.length; gunIndex++) {
      let eachGun = parentEnemy.gunList[gunIndex]
      this.controlGun(parentEnemy, eachGun, gunIndex)
    }
  }

  controlGun (parentEnemy, eachGun, gunIndex) {

  }
}

export class MoveGunsAction extends Action {
  constructor (durationSecond) {
    super(durationSecond)
    this.useless = null
  }

  execute (parentEnemy) {
    this.controlAllGuns(parentEnemy)
  }
  moveGun (eachGun, targetXPosition, targetYPosition, easingFactor) {
    eachGun.xPosition += (targetXPosition - eachGun.xPosition) * 0.1
    eachGun.yPosition += (targetYPosition - eachGun.yPosition) * 0.1
  }
}

export class AroundDeployGunsAction extends MoveGunsAction {
  constructor () {
    super(1.25)
  }

  controlGun (parentEnemy, eachGun, gunIndex) {
    let gunPositionAngle = Math.PI * 2.0 * (gunIndex / parentEnemy.gunList.length)
    let targetXPosition = parentEnemy.xPosition + 160.0 * Math.cos(gunPositionAngle)
    let targetYPosition = parentEnemy.yPosition + 60.0 * Math.sin(gunPositionAngle)
    this.moveGun(eachGun, targetXPosition, targetYPosition, 0.02)
  }
}

export class FrontDeployGunsAction extends MoveGunsAction {
  constructor () {
    super(1.25)
  }

  controlGun (parentEnemy, eachGun, gunIndex) {
    let targetXPosition = parentEnemy.xPosition + 80.0 * (gunIndex - (parentEnemy.gunLis.length.size() - 1) * 0.5)
    let targetYPosition = parentEnemy.yPosition + 60.0
    this.moveGun(eachGun, targetXPosition, targetYPosition, 0.02)
  }
}

export class WaitAction extends Action {
  constructor () {
    super(1)
  }

  execute (parentEnemy) {
  }
  controlGun (parentEnemy, eachGun, gunIndex) {
  }
}

export class HoldGunsAction extends MoveGunsAction {
  constructor () {
    super(0.5)
  }

  controlGun (parentEnemy, eachGun, gunIndex) {
    let targetXPosition = parentEnemy.xPosition
    let targetYPosition = parentEnemy.yPosition
    this.moveGun(eachGun, targetXPosition, targetYPosition, 0.9)
  }
}

class CyclicFireAction extends Action {
  constructor (durationSecond, fireFrequencyPerSecond) {
    super(durationSecond)
    this.fireIntervalFrameCount = 30 / fireFrequencyPerSecond
  }

  execute (parentEnemy) {
    this.controlAllGuns(parentEnemy)
  }
}

export class SpiralFireAction extends CyclicFireAction {
  constructor () {
    super(4, 30) // duration, fire frequency
  }

  controlGun (parentEnemy, eachGun, gunIndex) {
    let gunPositionAngle = 2 * Math.PI * gunIndex / (parentEnemy.gunList.length + 0.5 * parentEnemy.currentActionFrameCount * 2 * Math.PI / 30)
    eachGun.xPosition = parentEnemy.xPosition + 160.0 * Math.cos(gunPositionAngle)
    eachGun.yPosition = parentEnemy.yPosition + 60.0 * Math.sin(gunPositionAngle)

    eachGun.baseMuzzleDirectionAngle = gunPositionAngle
    if (parentEnemy.properFrameCount % this.fireIntervalFrameCount === 0) {
      eachGun.fire()
    }
  }
}
