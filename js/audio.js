// ========================================
// AUDIO – Sound effects and feedback
// ========================================

const Audio = {
    initialized: false,
    audioContext: null,
    soundEnabled: localStorage.getItem('soundEnabled') !== 'false', // Default enabled

    init() {
        if (this.initialized) return;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    },

    // Soft chime for timer end (gradually gets louder)
    chimeSuccess() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        const duration = 3; // 3 second crescendo
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        // Ascending two-note chime
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.setValueAtTime(1000, now + 0.2);
        
        // Start quiet and gradually increase (crescendo)
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.15, now + duration);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration + 0.3);
        
        osc.start(now);
        osc.stop(now + duration + 0.3);
    },

    // Subtle click for navigation
    click() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.frequency.setValueAtTime(400, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        
        osc.start(now);
        osc.stop(now + 0.05);
    },

    // Completion sound
    success() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        const notes = [523.25, 659.25, 783.99]; // C, E, G
        
        notes.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.frequency.setValueAtTime(freq, now + i * 0.05);
            gain.gain.setValueAtTime(0.15, now + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.3);
            
            osc.start(now + i * 0.05);
            osc.stop(now + i * 0.05 + 0.3);
        });
    },

    // Toggle audio
    toggle() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('soundEnabled', this.soundEnabled);
        return this.soundEnabled;
    }
};

// Initialize audio context on first user interaction
document.addEventListener('click', () => {
    Audio.init();
}, { once: true });
