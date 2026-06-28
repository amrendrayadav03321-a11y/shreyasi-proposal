/**
 * Web Audio API Romantic Music Box Synthesizer
 * Plays Pachelbel's Canon in D melody with a wind-up music-box timber.
 * Completely self-contained, zero asset download dependencies.
 */

class RomanticSynthesizer {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.sequenceTimer = null;
    
    // Melody notes and frequencies (Key of D major/B minor)
    this.notes = {
      'D4': 293.66, 'E4': 329.63, 'F#4': 369.99, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88, 'C#5': 554.37,
      'D5': 587.33, 'E5': 659.25, 'F#5': 739.99, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77, 'C#6': 1109.73,
      'D6': 1174.66, 'E6': 1318.51, 'F#6': 1479.98
    };

    // Pachelbel's Canon in D - Sweet, simplified music box arrangement
    this.melody = [
      // Section 1: Intro / Theme
      { note: 'F#5', duration: 1.0 }, { note: 'A5', duration: 1.0 },
      { note: 'E5', duration: 1.0 }, { note: 'A5', duration: 1.0 },
      { note: 'D5', duration: 1.0 }, { note: 'F#5', duration: 1.0 },
      { note: 'C#5', duration: 1.0 }, { note: 'E5', duration: 1.0 },
      { note: 'B4', duration: 1.0 }, { note: 'D5', duration: 1.0 },
      { note: 'A4', duration: 1.0 }, { note: 'C#5', duration: 1.0 },
      { note: 'B4', duration: 1.0 }, { note: 'D5', duration: 1.0 },
      { note: 'C#5', duration: 1.0 }, { note: 'E5', duration: 1.0 },

      // Section 2: Arpeggiated lifting theme
      { note: 'F#5', duration: 0.5 }, { note: 'D5', duration: 0.5 }, { note: 'A5', duration: 0.5 }, { note: 'F#5', duration: 0.5 },
      { note: 'E5', duration: 0.5 }, { note: 'C#5', duration: 0.5 }, { note: 'A5', duration: 0.5 }, { note: 'E5', duration: 0.5 },
      { note: 'D5', duration: 0.5 }, { note: 'B4', duration: 0.5 }, { note: 'F#5', duration: 0.5 }, { note: 'D5', duration: 0.5 },
      { note: 'C#5', duration: 0.5 }, { note: 'A4', duration: 0.5 }, { note: 'E5', duration: 0.5 }, { note: 'C#5', duration: 0.5 },
      { note: 'B4', duration: 0.5 }, { note: 'G4', duration: 0.5 }, { note: 'D5', duration: 0.5 }, { note: 'B4', duration: 0.5 },
      { note: 'A4', duration: 0.5 }, { note: 'F#4', duration: 0.5 }, { note: 'D5', duration: 0.5 }, { note: 'A4', duration: 0.5 },
      { note: 'B4', duration: 0.5 }, { note: 'G4', duration: 0.5 }, { note: 'D5', duration: 0.5 }, { note: 'B4', duration: 0.5 },
      { note: 'C#5', duration: 0.5 }, { note: 'A4', duration: 0.5 }, { note: 'E5', duration: 0.5 }, { note: 'C#5', duration: 0.5 },

      // Section 3: High sweet melody
      { note: 'D6', duration: 1.0 }, { note: 'C#6', duration: 1.0 },
      { note: 'B5', duration: 1.0 }, { note: 'A5', duration: 1.0 },
      { note: 'G5', duration: 1.0 }, { note: 'F#5', duration: 1.0 },
      { note: 'G5', duration: 1.0 }, { note: 'A5', duration: 1.0 },
      { note: 'D6', duration: 0.5 }, { note: 'F#5', duration: 0.5 }, { note: 'E5', duration: 0.5 }, { note: 'G5', duration: 0.5 },
      { note: 'F#5', duration: 0.5 }, { note: 'D5', duration: 0.5 }, { note: 'C#5', duration: 0.5 }, { note: 'E5', duration: 0.5 },
      { note: 'D5', duration: 0.5 }, { note: 'B4', duration: 0.5 }, { note: 'A4', duration: 0.5 }, { note: 'G4', duration: 0.5 },
      { note: 'A4', duration: 1.0 }, { note: 'C#5', duration: 1.0 }
    ];

    // Celebration Joyful Arpeggio
    this.celebrationMelody = [
      { note: 'D5', duration: 0.25 }, { note: 'F#5', duration: 0.25 }, { note: 'A5', duration: 0.25 }, { note: 'D6', duration: 0.25 },
      { note: 'F#6', duration: 0.25 }, { note: 'D6', duration: 0.25 }, { note: 'A5', duration: 0.25 }, { note: 'F#5', duration: 0.25 },
      { note: 'E5', duration: 0.25 }, { note: 'G#5', duration: 0.25 }, { note: 'B5', duration: 0.25 }, { note: 'E6', duration: 0.25 },
      { note: 'G#6', duration: 0.25 }, { note: 'E6', duration: 0.25 }, { note: 'B5', duration: 0.25 }, { note: 'G#5', duration: 0.25 },
      { note: 'F#5', duration: 0.25 }, { note: 'A5', duration: 0.25 }, { note: 'C#6', duration: 0.25 }, { note: 'F#6', duration: 0.25 },
      { note: 'A6', duration: 0.25 }, { note: 'F#6', duration: 0.25 }, { note: 'C#6', duration: 0.25 }, { note: 'A5', duration: 0.25 },
      { note: 'G5', duration: 0.25 }, { note: 'B5', duration: 0.25 }, { note: 'D6', duration: 0.25 }, { note: 'G6', duration: 0.25 },
      { note: 'B6', duration: 0.25 }, { note: 'G6', duration: 0.25 }, { note: 'D6', duration: 0.25 }, { note: 'B5', duration: 0.25 }
    ];

    this.currentMelody = this.melody;
    this.noteIndex = 0;
    this.tempo = 720; // ms per beat (longer is slower)
    this.nextNoteTime = 0;
    this.scheduleAheadTime = 0.1; // seconds
    this.lookahead = 25.0; // ms
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    // Master volume control
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.20, this.ctx.currentTime); // Gentle default volume
    this.masterGain.connect(this.ctx.destination);
  }

  // Create a single music-box style note
  playNote(frequency, startTime, duration) {
    if (!this.ctx) return;

    // Oscillator 1: fundamental tone (Sine wave)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(frequency, startTime);

    // Oscillator 2: First overtone (Sine wave, octave higher, weaker)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 2, startTime);
    const osc2Gain = this.ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.18, startTime);

    // Oscillator 3: Second overtone (Triangle, 3x frequency, very subtle crispness)
    const osc3 = this.ctx.createOscillator();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(frequency * 3, startTime);
    const osc3Gain = this.ctx.createGain();
    osc3Gain.gain.setValueAtTime(0.06, startTime);

    // LFO for sweet wind-up vibrato effect
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 5.5; // Vibrato speed (Hz)
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 1.8; // Vibrato depth (Hz deviation)
    
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);

    // Envelope node to shape the plucky music box decay
    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(0, startTime);
    // Instant attack (pluck)
    noteGain.gain.linearRampToValueAtTime(0.7, startTime + 0.006);
    // Slow decay/release to mimic mechanical metal tines ringing out
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 1.8);

    // Connections
    osc1.connect(noteGain);
    osc2.connect(osc2Gain);
    osc2Gain.connect(noteGain);
    osc3.connect(osc3Gain);
    osc3Gain.connect(noteGain);
    
    noteGain.connect(this.masterGain);

    // Start & Stop
    osc1.start(startTime);
    osc2.start(startTime);
    osc3.start(startTime);
    lfo.start(startTime);

    const stopTime = startTime + duration * 2;
    osc1.stop(stopTime);
    osc2.stop(stopTime);
    osc3.stop(stopTime);
    lfo.stop(stopTime);
  }

  // Play a quick, clean chime effect for menu interactions
  playChime() {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    const now = this.ctx.currentTime;
    this.playNote(this.notes['D5'], now, 0.4);
    this.playNote(this.notes['F#5'], now + 0.08, 0.4);
    this.playNote(this.notes['A5'], now + 0.16, 0.5);
    this.playNote(this.notes['D6'], now + 0.24, 0.8);
  }

  // Sequencer scheduler loop
  scheduler() {
    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleNextNote(this.nextNoteTime);
      this.advanceNote();
    }
    this.sequenceTimer = setTimeout(() => this.scheduler(), this.lookahead);
  }

  scheduleNextNote(time) {
    const currentNoteObj = this.currentMelody[this.noteIndex];
    if (!currentNoteObj || !currentNoteObj.note) return;
    
    const freq = this.notes[currentNoteObj.note];
    // Scale duration slightly based on tempo
    const duration = currentNoteObj.duration * (this.tempo / 1000);
    
    this.playNote(freq, time, duration);
  }

  advanceNote() {
    const currentNoteObj = this.currentMelody[this.noteIndex];
    const duration = currentNoteObj ? currentNoteObj.duration : 1.0;
    
    // Move next note time forward
    this.nextNoteTime += duration * (this.tempo / 1000);
    
    // Cycle index
    this.noteIndex = (this.noteIndex + 1) % this.currentMelody.length;
  }

  // Start the background lullaby loop
  startMelody() {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    this.nextNoteTime = this.ctx.currentTime + 0.05;
    this.scheduler();
  }

  stopMelody() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    clearTimeout(this.sequenceTimer);
  }

  // Switch to the fast, happy celebration arpeggios
  switchToCelebration() {
    this.currentMelody = this.celebrationMelody;
    this.noteIndex = 0;
    this.tempo = 500; // Speed up the tempo for celebration
    
    if (this.ctx) {
      this.nextNoteTime = this.ctx.currentTime + 0.05;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      // Smooth transition in gain to prevent pops
      const targetVolume = this.isMuted ? 0 : 0.20;
      this.masterGain.gain.setTargetAtTime(targetVolume, this.ctx.currentTime, 0.15);
    }
    return this.isMuted;
  }
}

// Export global instance
const synth = new RomanticSynthesizer();
window.synth = synth;
