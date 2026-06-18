/*
 * clothSim.js — pure-JS Verlet mass-spring cloth engine (no physics library).
 *
 * A GRID_W x GRID_H particle grid (AoS Float32 positions shared with the BufferGeometry).
 * The full top row is pinned across the width; structural (right/down) + bend (skip-one)
 * distance constraints are relaxed each fixed step. Horizontal rest length is the spacing
 * scaled by 1/TOP_GATHER, so excess fabric buckles into real vertical folds — never by
 * gathering the pins inward. The grid settles to a draped pose at construction.
 */

export const GRID_W = 60; // particles across (watch FPS: back this off FIRST if it dips)
export const GRID_H = 84; // particles down
export const FILL_W = 1.35; // oversize vs viewport so folds/billow never expose an edge
export const FILL_H = 1.25;
export const FIXED_DT = 1 / 60; // fixed simulation timestep

// Excess horizontal fabric => vertical folds. Horizontal rest length = spacing / TOP_GATHER.
// TOP_GATHER < 1 => more excess => deeper folds. Pins always span the FULL width.
const TOP_GATHER = 0.72;

// Integration.
const GRAVITY = 6.0; // world units / s^2, pulling -Y
const DAMPING = 0.985; // Verlet velocity retention — underdamped so it flutters, then settles
const MAX_VEL = 0.3; // per-step displacement clamp (stability; a touch higher for forceful shoves)
const MAX_VEL_OPEN = 1.5; // raised clamp during the open lift so the cloth flies up coherently
const STIFFNESS_ITERS = 14; // constraint relaxation passes per step
const STRUCTURAL_STIFFNESS = 1.0;
const BEND_STIFFNESS = 0.2; // skip-one constraints kept soft so folds stay pronounced

// Subtle, spatially-varying idle wind so the curtain breathes organically (not a uniform
// pulse). Layered sines sampled per particle position + slow time; dominant Z, slight XY.
const IDLE_WIND_AMP = 0.5; // world units / s^2
const IDLE_WIND_SPEED = 0.35; // time scale

// Pointer "gust" wind — a jet of air that physically SHOVES the opaque fabric (no see-through).
// Position/intensity/direction are set per frame from the cursor. Broad, soft falloff.
export const WIND_RADIUS = 2.0; // world-units reach of the gust (wide, soft)
const WIND_STRENGTH = 80; // peak acceleration at full gust (strong, speed-scaled in CurtainCloth)
const WIND_DRAG = 1.0; // PRIMARY: drag the cloth along the pointer's motion direction
const WIND_BILLOW = 0.55; // SECONDARY: +Z bulge so it billows/ripples (not a flat slide)

// Fold seed: bias the buckling into evenly spaced vertical folds (no flat, unstable frame).
// Fewer waves => deeper, more pronounced folds.
const FOLD_SEED_WAVES = 5;
const FOLD_SEED_AMP = 0.14;
const FOLD_SEED_NOISE = 0.02;

// Settle at construction so the cloth loads already draped (it keeps settling live after).
const SETTLE_STEPS = 80;

export class ClothSim {
  // positionArray is the geometry's position attribute (flat grid) — mutated in place.
  constructor(positionArray, cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.count = cols * rows;
    this.pos = positionArray;
    this.prev = new Float32Array(positionArray); // copy => zero initial velocity
    this.pinned = new Uint8Array(this.count);
    this.time = 0;

    // Pointer-gust wind state (set per frame via setWind).
    this.windX = 0;
    this.windY = 0;
    this.windI = 0; // gust intensity (0 at rest)
    this.windDirX = 0;
    this.windDirY = 0;
    this.opening = false; // during the open lift the velocity clamp is raised

    // Pin the full top row.
    for (let i = 0; i < cols; i += 1) this.pinned[i] = 1;

    // Grid spacings read from the flat geometry.
    const xOf = (i, j) => this.pos[(j * cols + i) * 3];
    const yOf = (i, j) => this.pos[(j * cols + i) * 3 + 1];
    this.spacingX = xOf(1, 0) - xOf(0, 0);
    this.spacingY = yOf(0, 0) - yOf(0, 1);
    this.baseTopY = yOf(0, 0); // top-row Y; the pins lift from here during the open

    this._seedFolds();
    this._buildConstraints();
    this._settle();
  }

  // Per-frame pointer gust: world position, smoothed intensity, and motion direction.
  setWind(x, y, intensity, dirX, dirY) {
    this.windX = x;
    this.windY = y;
    this.windI = intensity;
    this.windDirX = dirX;
    this.windDirY = dirY;
  }

  setOpening(v) {
    this.opening = v;
  }

  // Lift the pinned top row to baseTopY + offsetY (X/Z unchanged). The folded body follows via
  // the constraints, so the whole simulated curtain flies up with its folds.
  liftPins(offsetY) {
    const y = this.baseTopY + offsetY;
    for (let i = 0; i < this.cols; i += 1) {
      this.pos[i * 3 + 1] = y;
      this.prev[i * 3 + 1] = y;
    }
  }

  _seedFolds() {
    const { cols, rows, pos, prev, pinned } = this;
    for (let j = 0; j < rows; j += 1) {
      for (let i = 0; i < cols; i += 1) {
        const p = j * cols + i;
        if (pinned[p]) continue;
        const wave = Math.sin((i / (cols - 1)) * Math.PI * FOLD_SEED_WAVES);
        const z = wave * FOLD_SEED_AMP + (Math.random() - 0.5) * FOLD_SEED_NOISE;
        pos[p * 3 + 2] = z;
        prev[p * 3 + 2] = z; // seed velocity-free so it relaxes, not snaps
      }
    }
  }

  _buildConstraints() {
    const { cols, rows } = this;
    const Lx = this.spacingX / TOP_GATHER; // excess horizontal fabric
    const Ly = this.spacingY;
    const a = [];
    const b = [];
    const rest = [];
    const stiff = [];
    const add = (pa, pb, r, s) => {
      a.push(pa);
      b.push(pb);
      rest.push(r);
      stiff.push(s);
    };
    for (let j = 0; j < rows; j += 1) {
      for (let i = 0; i < cols; i += 1) {
        const p = j * cols + i;
        if (i < cols - 1) add(p, p + 1, Lx, STRUCTURAL_STIFFNESS); // structural right
        if (j < rows - 1) add(p, p + cols, Ly, STRUCTURAL_STIFFNESS); // structural down
        if (i < cols - 2) add(p, p + 2, 2 * Lx, BEND_STIFFNESS); // bend right
        if (j < rows - 2) add(p, p + 2 * cols, 2 * Ly, BEND_STIFFNESS); // bend down
      }
    }
    this.cA = Uint16Array.from(a);
    this.cB = Uint16Array.from(b);
    this.cRest = Float32Array.from(rest);
    this.cStiff = Float32Array.from(stiff);
    this.cCount = a.length;
  }

  _integrate(dt) {
    const { pos, prev, pinned, count } = this;
    const dt2 = dt * dt;
    this.time += dt;
    const t = this.time * IDLE_WIND_SPEED;
    const maxVel = this.opening ? MAX_VEL_OPEN : MAX_VEL;
    for (let p = 0; p < count; p += 1) {
      if (pinned[p]) continue;
      const i = p * 3;
      const cx = pos[i];
      const cy = pos[i + 1];
      const cz = pos[i + 2];

      // Layered idle wind sampled at this particle's position: dominant Z, slight XY.
      let wz =
        (Math.sin(cx * 0.6 + t * 1.3) * 0.6 +
          Math.sin(cy * 0.5 + cx * 0.25 - t * 1.7) * 0.4) *
        IDLE_WIND_AMP;
      let wx = Math.sin(cy * 0.7 + t * 1.1) * 0.3 * IDLE_WIND_AMP;
      let wy = Math.sin(cx * 0.4 - t * 0.9) * 0.15 * IDLE_WIND_AMP;

      // Pointer gust: PRIMARILY drag the fabric along the pointer's motion direction (the air
      // sweeps the cloth where the cursor goes), plus a secondary +Z billow so it bulges and
      // ripples. Broad soft falloff over WIND_RADIUS. Eases in/out via windI.
      if (this.windI > 1e-4) {
        const ddx = cx - this.windX;
        const ddy = cy - this.windY;
        const r2 = WIND_RADIUS * WIND_RADIUS;
        const d2 = ddx * ddx + ddy * ddy;
        if (d2 < r2) {
          let fall = 1 - d2 / r2;
          fall *= fall;
          const g = fall * this.windI * WIND_STRENGTH;
          wx += this.windDirX * g * WIND_DRAG;
          wy += this.windDirY * g * WIND_DRAG;
          wz += g * WIND_BILLOW;
        }
      }

      let nx = cx + (cx - prev[i]) * DAMPING + wx * dt2;
      let ny = cy + (cy - prev[i + 1]) * DAMPING - GRAVITY * dt2 + wy * dt2;
      let nz = cz + (cz - prev[i + 2]) * DAMPING + wz * dt2;

      // Per-step velocity clamp keeps the higher-resolution grid stable.
      const vx = nx - cx;
      const vy = ny - cy;
      const vz = nz - cz;
      const v2 = vx * vx + vy * vy + vz * vz;
      if (v2 > maxVel * maxVel) {
        const s = maxVel / Math.sqrt(v2);
        nx = cx + vx * s;
        ny = cy + vy * s;
        nz = cz + vz * s;
      }

      prev[i] = cx;
      prev[i + 1] = cy;
      prev[i + 2] = cz;
      pos[i] = nx;
      pos[i + 1] = ny;
      pos[i + 2] = nz;
    }
  }

  _solve() {
    const { pos, pinned, cA, cB, cRest, cStiff, cCount } = this;
    for (let it = 0; it < STIFFNESS_ITERS; it += 1) {
      for (let c = 0; c < cCount; c += 1) {
        const a = cA[c];
        const b = cB[c];
        const pa = pinned[a];
        const pb = pinned[b];
        if (pa && pb) continue;
        const ai = a * 3;
        const bi = b * 3;
        const dx = pos[bi] - pos[ai];
        const dy = pos[bi + 1] - pos[ai + 1];
        const dz = pos[bi + 2] - pos[ai + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < 1e-6) continue;
        const diff = ((d - cRest[c]) / d) * cStiff[c];
        let wa;
        let wb;
        if (pa) {
          wa = 0;
          wb = 1;
        } else if (pb) {
          wa = 1;
          wb = 0;
        } else {
          wa = 0.5;
          wb = 0.5;
        }
        const ox = dx * diff;
        const oy = dy * diff;
        const oz = dz * diff;
        pos[ai] += ox * wa;
        pos[ai + 1] += oy * wa;
        pos[ai + 2] += oz * wa;
        pos[bi] -= ox * wb;
        pos[bi + 1] -= oy * wb;
        pos[bi + 2] -= oz * wb;
      }
    }
  }

  step(dt) {
    this._integrate(dt);
    this._solve();
  }

  _settle() {
    for (let s = 0; s < SETTLE_STEPS; s += 1) this.step(FIXED_DT);
  }
}
