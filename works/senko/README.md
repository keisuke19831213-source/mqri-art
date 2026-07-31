# 旋光 — Senkō / The Rotation of Light

光は、闇を軸にして回る。

An optical-vortex artwork. A superposition of Laguerre–Gaussian modes is
integrated spectrally and rendered as single scattering through mist, in real
time, in one self-contained `index.html` (WebGL2).

## The physics

**Rotation.** Each mode carries orbital angular momentum `ℓħ`. Detune its
frequency in proportion to that charge —

```
ω_ℓ = ω₀ + ℓΔ
```

— and every term of the superposition picks up `exp(iℓ(φ − Δt))`. The intensity
then depends on azimuth *only* through `φ − Δt`, so the entire field turns as an
exact rigid rotor at `Δ`, regardless of how many modes are stacked. This is the
mechanism behind the rotational-Doppler and spin-to-orbital experiments, not an
animation curve.

**Why the petals are sharp.** The Gouy index `G = 2p + |ℓ| + 1` sets how fast a
mode's phase advances along `z`. Two modes sharing the same `G` hold a
`z`-invariant relative phase, so their interference pattern does not screw along
the axis. The conjugate pair

```
LG(p, +ℓ) ⊕ LG(p, −ℓ)
```

always satisfies this, and at equal amplitude reduces to `cos²(ℓ(φ − Δt))`:
`2|ℓ|` petals in `p+1` concentric rings, separated by **exact zeros of the
field**. Every dark line in the image is a null, not a painted shadow.

**Why the camera sits on the axis.** For an eye on the beam axis, azimuth is
exactly constant along every ray, so integrating through the volume cannot smear
the petals. Viewed obliquely, a single ray crosses many `z` at different twist
angles and averages the structure into mush. The axial view is therefore a long
telephoto from well back, which also drives the perspective smear
`(d+z)/(d−z)` down toward 1.

**Where the colour comes from.** The Rayleigh range `z_R = πw₀²/λ` is
wavelength-dependent, so each colour diverges at its own rate. The amber and
blue at the petal edges are dispersion, not tinting.

**The dark eye.** On the axis the phase is undefined and the amplitude is
identically zero — a line of darkness manufactured by light. Every mode used
here has `|ℓ| ≥ 1`, so the core is always open.

## The rendering

- Paraxial LG modes evaluated exactly: `w(z)`, the wavefront-curvature phase
  written as `k r² z / 2(z² + z_R²)` so it has no pole at the waist, and the
  Gouy term `(2p+|ℓ|+1)·arctan(z/z_R)`. Generalised Laguerre polynomials by the
  three-term recurrence; each mode is normalised by its numerically-found peak.
- Stratified spectral sampling with interleaved-gradient-noise offsets →
  Wyman–Sloan–Shirley (JCGT 2013) multi-lobe fits to the CIE 1931 standard
  observer → illuminant adaptation onto D65 → linear sRGB → minimal AgX.
- Single-scattering volume raymarch through a super-Gaussian window of mist,
  Henyey–Greenstein phase, Beer–Lambert transmittance.
- RGBA16F throughout: temporal accumulation, GPU auto-exposure with no readback
  stall, six-level dual-filter bloom, blue-noise dither, adaptive resolution
  driven by the presented frame interval.

## Controls

| | |
|---|---|
| `1`–`5` | 位相配置 — mode set |
| `Q` | 光源スペクトル — broadband / three laser lines / monochromatic / achromatic |
| `A` | 軸上 ⇄ 側面 — axial or side view |
| `drag` / `scroll` | orbit / zoom |
| `space` | 静止 — freeze, and switch to a 112-step × 8λ integration |
| `H` | 解説 &nbsp; `F` 無地 &nbsp; `S` 保存 |

## Mode sets

| | modes | result |
|---|---|---|
| 双 | `LG(0,±1)` | 2 petals — a rotating blade |
| 花 | `LG(0,±4)` | 8 petals |
| 輪 | `LG(1,±5)` | 10 petals, 2 rings |
| 曼 | `LG(2,±9)` | 18 petals, 3 rings |
| 螺 | `LG(0,1) ⊕ LG(0,5)` | twisted — unequal `G`, so it screws along the axis |

The side view (`A`) is a different work: the beam's hourglass flare, with the
vortex core running down it as a dark thread, and red opening faster than blue.

---

No build step, no dependencies, no network. Requires WebGL2 with
`EXT_color_buffer_float`.
