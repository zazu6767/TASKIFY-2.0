import confetti from 'canvas-confetti';

export function fireConfetti() {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#f97316', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'],
    });
  } catch {
    // Graceful fallback if canvas is restricted
  }
}

export function fireCelebrationCannon() {
  try {
    const end = Date.now() + 1000;
    const colors = ['#f97316', '#10b981', '#8b5cf6', '#ec4899', '#38bdf8'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch {
    // Graceful fallback
  }
}
