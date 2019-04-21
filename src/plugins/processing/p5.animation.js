class Animation {
  constructor (instance, args) {
    this.pInst = instance
    this.frameArguments = args
    this.i = 0
    this.images = []
    this.frame = 0
    this.cycles = 0
    this.targetFrame = -1
    this.offX = 0
    this.offY = 0
    this.frameDelay = 4
    this.playing = true
    this.visible = true
    this.looping = true
    this.frameChanged = false
    this.imageCollider = false

    if (this.frameArguments && this.frameArguments.length !== 0) {
      for (this.i = 0; this.i < this.frameArguments.length; this.i++) {
        // print("loading "+fileNames[i]);
        this.images.push(this.pInst.loadImage(this.frameArguments[this.i]))
      }
    }
  }
  draw (x, y, r) {
    this.xpos = x
    this.ypos = y
    this.rotation = r || 0

    if (this.visible) {
      // only connection with the sprite class
      // if animation is used independently draw and update are the sam
      // if (!this.isSpriteAnimation) { this.update() }
      this.update()
      // this.currentImageMode = g.imageMode;
      this.pInst.push()
      this.pInst.imageMode(this.pInst.CENTER)

      this.pInst.translate(this.xpos, this.ypos)
      if (this.pInst._angleMode === this.pInst.RADIANS) {
        this.pInst.rotate(this.pInst.radians(this.rotation))
      } else {
        this.pInst.rotate(this.rotation)
      }

      if (this.images[this.frame] !== undefined) {
        this.pInst.image(this.images[this.frame], this.offX, this.offY)
      } else {
        this.pInst.print('Warning undefined frame ' + this.frame)
        // this.isActive = false;
      }

      this.pInst.pop()
    }
  };

  update () {
    this.cycles++
    let previousFrame = this.frame
    this.frameChanged = false

    // go to frame
    if (this.images.length === 1) {
      this.playing = false
      this.frame = 0
    }

    if (this.playing && this.cycles % this.frameDelay === 0) {
      // going to target frame up
      if (this.targetFrame > this.frame && this.targetFrame !== -1) {
        this.frame++
      } else if (this.targetFrame < this.frame && this.targetFrame !== -1) {
        this.frame--
      } else if (this.targetFrame === this.frame && this.targetFrame !== -1) {
        this.playing = false
      } else if (this.looping) {
        // if next frame is too high
        if (this.frame >= this.images.length - 1) { this.frame = 0 } else { this.frame++ }
      } else {
        // if next frame is too high
        if (this.frame < this.images.length - 1) { this.frame++ }
      }
    }

    if (previousFrame !== this.frame) { this.frameChanged = true }
  };// end update

  animation (anim, x, y) {
    anim.draw(x, y)
  }
  loadAnimation (...args) {
    return new Animation(this.pInst, [...args])
  }
}

export default Animation
