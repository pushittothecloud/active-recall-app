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
        
        // Preload voices for speech synthesis
        if ('speechSynthesis' in window) {
            speechSynthesis.getVoices();
        }
    },

    // Soft chime for timer end (gradually gets louder) with harmony
    chimeSuccess() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        const duration = 3; // 3 second crescendo
        
        // Create a harmonious chord (C major: C, E, G)
        const frequencies = [
            { freq: 523.25 },  // C5
            { freq: 659.25 },  // E5
            { freq: 783.99 }   // G5
        ];
        
        frequencies.forEach(({ freq }) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.frequency.setValueAtTime(freq, now);
            
            // Start quiet and gradually increase (crescendo)
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.linearRampToValueAtTime(0.15, now + duration);
            gain.gain.exponentialRampToValueAtTime(0.01, now + duration + 0.3);
            
            osc.start(now);
            osc.stop(now + duration + 0.3);
        });
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

    // Celebration sound – triumphant rising tones
    celebration() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        // Triumphant ascending chord progression
        const sequences = [
            [523.25, 659.25, 783.99], // C, E, G (major)
            [587.33, 739.99, 880],    // D, F#, A (shifted up)
            [659.25, 783.99, 987.77]  // E, G, B (even higher)
        ];
        
        sequences.forEach((notes, seqIdx) => {
            notes.forEach((freq, noteIdx) => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                
                osc.connect(gain);
                gain.connect(this.audioContext.destination);
                
                const startTime = now + seqIdx * 0.25 + noteIdx * 0.05;
                
                osc.frequency.setValueAtTime(freq, startTime);
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
                
                osc.start(startTime);
                osc.stop(startTime + 0.4);
            });
        });
    },

    // Toggle audio
    toggle() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('soundEnabled', this.soundEnabled);
        return this.soundEnabled;
    },

    // Text-to-speech
    speak(text) {
        if (!('speechSynthesis' in window)) {
            console.log('Speech synthesis not supported');
            return;
        }
        
        try {
            // Cancel any ongoing speech
            speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 1;
            
            // Wait for voices to load if they haven't yet
            const voices = speechSynthesis.getVoices();
            console.log('Available voices:', voices.length);
            
            if (voices.length > 0) {
                // Try to find an English voice, fallback to first voice
                const englishVoice = voices.find(v => v.lang.includes('en')) || voices[0];
                utterance.voice = englishVoice;
                console.log('Using voice:', englishVoice.name);
            }
            
            // Set up event listeners
            utterance.onstart = () => console.log('Speech started');
            utterance.onend = () => console.log('Speech ended');
            utterance.onerror = (e) => console.log('Speech error:', e.error);
            
            speechSynthesis.speak(utterance);
            console.log('Speaking:', text);
        } catch (e) {
            console.log('Speech synthesis error:', e);
        }
    }
};

// Initialize audio context on first user interaction
document.addEventListener('click', () => {
    Audio.init();
}, { once: true });
