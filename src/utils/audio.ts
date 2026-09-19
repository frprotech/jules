// Web Audio API Synthesizer for Ambient Space Sounds & UI Feedback

class SpaceAudioEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private isInitialized = false;

  private init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();

    // Master Ambient Synth Loop
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    this.ambientGain.connect(this.ctx.destination);

    // Deep sub drone
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A

    const subFilter = this.ctx.createBiquadFilter();
    subFilter.type = 'lowpass';
    subFilter.frequency.setValueAtTime(120, this.ctx.currentTime);

    subOsc.connect(subFilter);
    subFilter.connect(this.ambientGain);
    subOsc.start();

    // Ambient space rumble
    const rumbleOsc = this.ctx.createOscillator();
    rumbleOsc.type = 'triangle';
    rumbleOsc.frequency.setValueAtTime(82.41, this.ctx.currentTime); // E2

    const rumbleGain = this.ctx.createGain();
    rumbleGain.gain.setValueAtTime(0.03, this.ctx.currentTime);

    rumbleOsc.connect(rumbleGain);
    rumbleGain.connect(this.ambientGain);
    rumbleOsc.start();

    this.isInitialized = true;
  }

  public setMuted(muted: boolean) {
    if (!this.isInitialized) this.init();
    if (!this.ctx || !this.ambientGain) return;

    if (this.ctx.state === 'suspended' && !muted) {
      this.ctx.resume();
    }

    const targetGain = muted ? 0 : 0.08;
    this.ambientGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.2);
  }

  public playSelectSound() {
    if (!this.ctx || this.ctx.state === 'suspended') return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime); // A4
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.15); // Ramp up to A5

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  public playClickSound() {
    if (!this.ctx || this.ctx.state === 'suspended') return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }
}

export const spaceAudio = new SpaceAudioEngine();
