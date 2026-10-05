// The exercise timeline under the map, as used to replay an exercise afterwards:
// play and pause, restart, a scrubber, a tick for each event, and each danger area's live window.
import { ExerciseClock } from './clock';
import { hhmm, minutes, type Scenario } from './scenario';

export class Timeline {
  private head: HTMLElement;
  private clockLabel: HTMLElement;
  private playButton: HTMLButtonElement;

  constructor(element: HTMLElement, private clock: ExerciseClock, scenario: Scenario) {
    element.innerHTML = `
      <button class="play">PAUSE</button>
      <button class="restart">RESTART</button>
      <div class="track"><div class="rail"></div><div class="head"></div><div class="hover"></div></div>
      <span class="time"></span>`;
    const track = element.querySelector<HTMLElement>('.track')!;
    const hover = element.querySelector<HTMLElement>('.hover')!;
    this.head = element.querySelector('.head')!;
    this.clockLabel = element.querySelector('.time')!;
    this.playButton = element.querySelector('.play')!;
    const span = clock.end - clock.start;
    const percent = (mins: number) => `${((mins - clock.start) / span) * 100}%`;

    // Each danger area's live window, as a band.
    for (const area of scenario.dangerAreas) for (const [from, to] of area.live) {
      const band = document.createElement('div');
      band.className = 'live-window';
      band.style.left = percent(minutes(from));
      band.style.width = `${((minutes(to) - minutes(from)) / span) * 100}%`;
      band.title = `${area.label} live ${from.replace(':', '')} to ${to.replace(':', '')}`;
      track.insertBefore(band, this.head);
    }
    // A tick for each event: hover to read it, click to jump to it.
    for (const event of scenario.events) {
      const tick = document.createElement('div');
      tick.className = 'tick';
      tick.style.left = percent(minutes(event.t));
      tick.addEventListener('mouseenter', () => {
        hover.innerHTML = `<div class="meta">${hhmm(minutes(event.t))} · ${event.from} → ${event.to}</div>${event.text}`;
        hover.style.left = tick.style.left;
        hover.classList.add('shown');
      });
      tick.addEventListener('mouseleave', () => hover.classList.remove('shown'));
      tick.addEventListener('pointerdown', (e) => { e.stopPropagation(); clock.jumpTo(event.t); });
      track.insertBefore(tick, this.head);
    }

    // Scrubbing: press or drag anywhere on the track.
    const seek = (e: PointerEvent) => {
      const r = track.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      clock.seek(clock.start + k * span);
    };
    track.addEventListener('pointerdown', (e) => { track.setPointerCapture(e.pointerId); seek(e); });
    track.addEventListener('pointermove', (e) => { if (track.hasPointerCapture(e.pointerId)) seek(e); });

    this.playButton.onclick = () => clock.toggle();
    element.querySelector<HTMLButtonElement>('.restart')!.onclick = () => clock.restart();
  }

  update(): void {
    const c = this.clock;
    this.head.style.left = `${((c.now - c.start) / (c.end - c.start)) * 100}%`;
    this.clockLabel.textContent = hhmm(c.now);
    const label = c.playing ? 'PAUSE' : 'PLAY';
    if (this.playButton.textContent !== label) this.playButton.textContent = label;
  }
}
