<template>
  <div class="confetti">
    <div
      v-for="confetti in confetti"
      :key="confetti.id"
      class="confetti-particle"
      :style="{
        backgroundColor: confetti.color,
        transform: `translate(${confetti.position[0]}px, ${
          confetti.position[1]
        }px)`,
        opacity: confetti.lifespan / confetti.decay
      }"
    ></div>
  </div>
</template>
<script>
const gravity = 150
const drag = 0.5

const colors = ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]

const baseVelocity = [0, -100]
const ramdomVelocity = [750, -200]
const velocityDirection = [0, -1]

const randomResistance = 0.4

const baseLifespan = 3
const randomLifespan = 2

const baseDecay = 0.5
const randomDecay = 1

export default {
  data: () => {
    const confetti = []

    for (let i = 0; i <= 100; i += 1) {
      confetti.push({
        position: [0, 0],
        velocity: [
          (Math.random() - velocityDirection[0] - 0.5) * ramdomVelocity[0] +
            baseVelocity[0],
          (Math.random() - velocityDirection[1] - 0.5) * ramdomVelocity[1] +
            baseVelocity[1]
        ],
        color: colors[Math.floor(Math.random() * colors.length)],
        resistance: (Math.random() - 0.5) * randomResistance,
        lifespan: Math.random() * randomLifespan + baseLifespan,
        decay: Math.random() * randomDecay + baseDecay
      })
    }

    return { confetti }
  },
  mounted() {
    let lastUpdate = Date.now()

    window.requestAnimationFrame(
      function step() {
        const now = Date.now()
        const dt = now - lastUpdate
        lastUpdate = now

        this.advance(dt / 1000)
        window.requestAnimationFrame(step.bind(this))
      }.bind(this)
    )
  },
  methods: {
    advance(deltaTime) {
      this.confetti = this.confetti
        .filter(confetti => confetti.lifespan > 0)
        .map(confetti => {
          confetti.velocity[1] += gravity * deltaTime
          // confetti.velocity[0] *= drag ** deltaTime
          // confetti.velocity[1] *= drag ** deltaTime
          confetti.velocity[0] *= (confetti.resistance + drag) ** deltaTime
          confetti.velocity[1] *= (confetti.resistance + drag) ** deltaTime
          confetti.position[0] += confetti.velocity[0] * deltaTime
          confetti.position[1] += confetti.velocity[1] * deltaTime
          confetti.lifespan -= deltaTime
          return confetti
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.confetti-particle {
  position: fixed;
  top: 25%;
  left: 50%;
  z-index: -1;
  width: 10px;
  height: 10px;
}
</style>
