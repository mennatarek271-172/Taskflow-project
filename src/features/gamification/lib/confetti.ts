import confetti from 'canvas-confetti'

export function fireConfetti(reducedMotion = false) {
  if (reducedMotion) return
  const duration = 2000
  const end = Date.now() + duration

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#3b82f6', '#f59e0b', '#22c55e', '#8b5cf6'],
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#3b82f6', '#f59e0b', '#22c55e', '#8b5cf6'],
    })

    if (Date.now() < end) requestAnimationFrame(frame)
  }

  frame()
}
