
export class PlayerController {
  constructor(world, options = {}) {
    this.world = world;
    this.speed = options.speed ?? 5;
    this.keys = new Set();
    this.enabled = true;
    this.touchDirection = { x: 0, z: 0 };

    this.onKeyDown = event => {
      const key = event.key.toLowerCase();
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
        event.preventDefault();
        this.keys.add(key);
      }
    };

    this.onKeyUp = event => this.keys.delete(event.key.toLowerCase());

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  setTouchDirection(x, z) {
    this.touchDirection.x = Math.max(-1, Math.min(1, x));
    this.touchDirection.z = Math.max(-1, Math.min(1, z));
  }

  update(deltaSeconds) {
    if (!this.enabled || !this.world?.player) return;

    let x = this.touchDirection.x;
    let z = this.touchDirection.z;

    if (this.keys.has("a") || this.keys.has("arrowleft")) x -= 1;
    if (this.keys.has("d") || this.keys.has("arrowright")) x += 1;
    if (this.keys.has("w") || this.keys.has("arrowup")) z -= 1;
    if (this.keys.has("s") || this.keys.has("arrowdown")) z += 1;

    const length = Math.hypot(x, z);
    if (length > 1) {
      x /= length;
      z /= length;
    }

    const player = this.world.player;
    player.position.x += x * this.speed * deltaSeconds;
    player.position.z += z * this.speed * deltaSeconds;

    // 월드 이동 범위를 제한한다.
    player.position.x = Math.max(-100, Math.min(100, player.position.x));
    player.position.z = Math.max(-100, Math.min(100, player.position.z));

    if (typeof this.world.setTarget === "function") {
      this.world.setTarget(null);
    }
  }

  destroy() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }
}
