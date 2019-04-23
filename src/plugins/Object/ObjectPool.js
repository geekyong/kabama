export class Poolable {
  isAllocated () {

  }
  setAllocated (indicator) {

  }
  getBelongingPool () {

  }
  setBelongingPool (pool) {

  }
  setAllocationIdentifier () {

  }
  getAllocationIdentifier (id) {

  }
  initialize () {

  }
}
export class ObjectPool extends Poolable {
  constructor (pSize) {
    super()
    this.index = 0
    this.temporalInstanceCount = 0
    this.allocationCount = 0
    this.poolSize = pSize || 256
    this.pool = []
    this.temporalInstanceList = []
  }

  /**
   * 判断是否可分配
   * @returns {boolean}
   */
  isAllocatable () {
    return this.index < this.poolSize
  }

  /**
   * 执行分配
   * @returns {*}
   */
  allocate () {
    if (this.isAllocatable() === false) {
      // Need exception handling
      return null
    }
    let allocatedInstance = this.pool[this.index]

    allocatedInstance.setAllocated(true)
    allocatedInstance.setAllocationIdentifier(this.allocationCount)
    this.index++
    this.allocationCount++

    return allocatedInstance
  }

  setTemporal (obj) {
    this.temporalInstanceList.push(obj) // set when array
    this.temporalInstanceCount++
  }
  allocateTemporal () {
    let allocatedInstance = this.allocate()
    this.setTemporal(allocatedInstance)
    return allocatedInstance
  }
  deallocate (killedObject) {
    if (!killedObject.isAllocated()) {
      return
    }

    killedObject.initialize()
    killedObject.setAllocated(false)
    killedObject.setAllocationIdentifier(-1)
    this.index--
    this.pool[this.index] = killedObject
  }
  storeObject (obj) {
    if (this.pool.length >= this.poolSize) {
      // Need exception handling
    }
    this.pool.push(obj)
    obj.setBelongingPool(this)
    obj.setAllocationIdentifier(-1)
    obj.setAllocated(false)
  }

  update () {
    console.log(this.temporalInstanceCount)
    while (this.temporalInstanceCount > 0) {
      this.temporalInstanceCount--
      this.deallocate(this.temporalInstanceList[this.temporalInstanceCount])
    }
    this.temporalInstanceList = [] // not needed when array
  }
}
