
class DNA {
  constructor (pInst, newGenes) {
    this.genes = new Array(1)
    this.p5 = pInst
    this.fit = 0.0
    this.target = []
    if (newGenes) {
      this.genes = newGenes
    }

    for (let i = 0; i < this.genes.length; i++) {
      this.genes[i] = this.p5.random(0, 1)
    }
  }

  copy () {
    return new DNA(this.p5, this.genes)
  }
  crossover (partner) {
    let children = new Array(this.genes.length)
    let crossover = this.p5.int(this.p5.random(this.genes.length))
    for (let i = 0; i < this.genes.length; i++) {
      if (i > crossover) children[i] = this.genes
      else children[i] = partner.genes[i]
    }
    let newGenes = new DNA(this.p5, children)
    return newGenes
  }
  fitness () {
    for (let i = 0; i < this.genes.length; i++) {

    }
  }

  mutate (m) {
    for (let i = 0; i < this.genes.length; i++) {
      if (this.p5.random(1) < m) {
        this.genes[i] = this.p5.random(0, 1)
      }
    }
  }
}
export default DNA
