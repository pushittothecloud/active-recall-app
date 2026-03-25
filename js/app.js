// ========================================
// APP – Main state and navigation
// ========================================

const App = {
    currentScreen: 'home',
    currentSessionStep: 0,
    timerInterval: null,
    timeRemaining: parseInt(localStorage.getItem('timerRemaining')) || 25 * 60, // 25 minutes in seconds

    // ========== INITIALIZATION ==========
    init() {
        Audio.init();
        this.render();
        this.updateFavicon();
        window.addEventListener('beforeunload', () => {
            this.saveCurrentSession();
        });
    },

    // ========== PROGRESS BAR ==========
    updateProgressBar() {
        const progressContainer = document.getElementById('progressBarContainer');
        const screenSequence = ['createSession', 'studyTimer', 'recall', 'reflection', 'saveSession'];
        const currentIndex = screenSequence.indexOf(this.currentScreen);

        // Show progress bar only during active session
        if (screenSequence.includes(this.currentScreen)) {
            progressContainer.style.display = 'block';

            let progressPercent = 0;
            let stepCount = 1;
            let currentStep = 1;
            let stepsHtml = '';

            if (this.currentScreen === 'createSession') {
                stepCount = 4;
                currentStep = this.currentSessionStep + 1;
                progressPercent = (currentStep / stepCount) * 100;
            } else {
                stepCount = screenSequence.length;
                currentStep = currentIndex + 1;
                progressPercent = (currentStep / stepCount) * 100;
            }

            // Generate step indicators
            for (let i = 1; i <= stepCount; i++) {
                const isCompleted = i < currentStep ? 'completed' : '';
                const isActive = i === currentStep ? 'active' : '';
                stepsHtml += `<div class="progress-step ${isActive} ${isCompleted}"></div>`;
            }

            // Determine phase name
            let phaseName = '';
            if (this.currentScreen === 'createSession') {
                const stepNames = ['Topic', 'Prior Knowledge', 'Questions', 'Difficulty'];
                phaseName = stepNames[this.currentSessionStep] || 'Setup';
            } else {
                const screenNames = {
                    'studyTimer': 'Study',
                    'recall': 'Recall',
                    'reflection': 'Reflect',
                    'saveSession': 'Save'
                };
                phaseName = screenNames[this.currentScreen] || 'Session';
            }

            progressContainer.innerHTML = `
                <div class="progress-section">
                    <div class="progress-label">📚 ${phaseName}</div>
                    <div class="progress-percentage">${currentStep}/${stepCount}</div>
                </div>
                <div class="progress-bar-track">
                    <div class="progress-bar-fill" style="width: ${progressPercent}%"></div>
                </div>
                <div class="progress-steps">
                    ${stepsHtml}
                </div>
            `;
        } else {
            progressContainer.style.display = 'none';
        }
    },

    // ========== RENDER ==========
    render() {
        const app = document.getElementById('app');
        let html = '';

        // Reset step counter for non-createSession screens
        if (this.currentScreen !== 'createSession') {
            this.currentSessionStep = 0;
        }

        switch (this.currentScreen) {
            case 'home':
                html = Screens.renderHome();
                break;
            case 'createSession':
                html = Screens.renderCreateSession();
                break;
            case 'studyTimer':
                html = Screens.renderStudyTimer();
                this.startTimer();
                break;
            case 'recall':
                html = Screens.renderRecall();
                break;
            case 'reflection':
                html = Screens.renderReflection();
                break;
            case 'celebration':
                html = Screens.renderCelebration();
                break;
            case 'saveSession':
                html = Screens.renderSaveSession();
                break;
            case 'quickRecall':
                html = Screens.renderQuickRecall();
                break;
            default:
                html = Screens.renderHome();
        }

        app.innerHTML = html;
        this.updateFavicon();
        this.updateProgressBar();
        
        // Add keyboard support for Enter key
        if (this.currentScreen === 'createSession') {
            this.setupFormKeyboardShortcuts();
        }
    },

    // ========== KEYBOARD SHORTCUTS ==========
    setupFormKeyboardShortcuts() {
        setTimeout(() => {
            const topic = document.getElementById('topic');
            const knowledge = document.getElementById('priorKnowledge');
            const questions = document.getElementById('targetQuestions');
            const difficulty = document.getElementById('predictedDifficulty');

            if (topic) {
                topic.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        App.nextStep('stepTopic');
                        setTimeout(() => document.getElementById('priorKnowledge')?.focus(), 100);
                    }
                });
            }

            if (knowledge) {
                knowledge.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        App.nextStep('stepKnowledge');
                        setTimeout(() => document.getElementById('targetQuestions')?.focus(), 100);
                    }
                });
            }

            // Questions textarea does not have Enter shortcut - users can press Tab to navigate

            if (difficulty) {
                difficulty.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        App.startStudyTimer();
                    }
                });
            }
        }, 0);
    },

    // ========== FAVICON ==========
    updateFavicon() {
        const favicon = document.getElementById('favicon');
        const emojis = {
            'home': '🧠',
            'createSession': '✍️',
            'studyTimer': '📚',
            'recall': '💭',
            'reflection': '🔍',
            'celebration': '🎉',
            'saveSession': '✓',
            'quickRecall': '⚡',
        };

        const emoji = emojis[this.currentScreen] || '🧠';
        favicon.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${emoji}</text></svg>`;
    },

    // ========== NAVIGATION ==========
    goToScreen(screen) {
        this.currentScreen = screen;
        // Reset session step when starting a new session
        if (screen === 'createSession') {
            this.currentSessionStep = 0;
        }
        this.render();
    },

    // ========== SESSION CREATION ==========
    nextStep(currentStep) {
        const steps = ['stepTopic', 'stepKnowledge', 'stepQuestions', 'stepDifficulty'];
        const currentIndex = steps.indexOf(currentStep);

        // Validate current step
        if (!this.validateStep(currentStep)) {
            return;
        }

        Audio.click();

        // Update progress
        this.currentSessionStep = currentIndex + 1;
        this.updateProgressBar();

        // Hide current step
        document.getElementById(currentStep).classList.add('hidden');

        // Show next step
        if (currentIndex < steps.length - 1) {
            document.getElementById(steps[currentIndex + 1]).classList.remove('hidden');
        }
    },

    prevStep() {
        const steps = ['stepTopic', 'stepKnowledge', 'stepQuestions', 'stepDifficulty'];
        const currentStep = document.querySelector('.form-group:not(.hidden)');
        const currentIndex = steps.indexOf(currentStep.id);

        if (currentIndex > 0) {
            // Update progress
            this.currentSessionStep = currentIndex - 1;
            this.updateProgressBar();

            currentStep.classList.add('hidden');
            document.getElementById(steps[currentIndex - 1]).classList.remove('hidden');
        }
    },

    // ========== CELEBRATION ACTIONS ==========
    handleCelebrationAction(action) {
        Audio.click();
        
        // Start a 5-minute timer for relax actions
        if (['quiet', 'walk', 'breathe'].includes(action)) {
            const minutes = 5;
            alert(`🧘 Take ${minutes} minutes to relax.\n\nYou'll get a reminder when it's done.`);
            
            // Set a simple timeout-based notification (in production, use Web Notifications API)
            setTimeout(() => {
                alert(`✨ Nice! Your brain is replaying what you learned. Ready to continue?`);
            }, minutes * 60 * 1000);
            return;
        }

        // Quick feedback for reward actions
        const messages = {
            'song': '🎵 Enjoy your victory song!',
            'snack': '🍕 You earned that snack!',
            'stretch': '🤸 Great stretch! Your brain will thank you.'
        };
        
        if (messages[action]) {
            alert(messages[action]);
        }
    },

    validateStep(stepId) {
        if (stepId === 'stepTopic') {
            const topic = document.getElementById('topic').value.trim();
            if (!topic) {
                alert('Please enter a topic');
                return false;
            }
        } else if (stepId === 'stepQuestions') {
            const questions = document.getElementById('targetQuestions').value.trim();
            if (!questions) {
                alert('Please write your target questions');
                return false;
            }
        }
        return true;
    },

    startStudyTimer() {
        // Validate and save form data
        const topic = document.getElementById('topic').value.trim();
        const priorKnowledge = document.getElementById('priorKnowledge').value.trim();
        const targetQuestions = document.getElementById('targetQuestions').value.trim();
        const predictedDifficulty = document.getElementById('predictedDifficulty').value.trim();

        if (!topic || !targetQuestions) {
            alert('Please complete all steps');
            return;
        }

        // Create and save session
        const session = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            topic,
            priorKnowledge,
            targetQuestions,
            predictedDifficulty,
            status: 'in-progress',
            brainDump: '',
            answers: {},
            reflection: {},
        };

        Storage.createSession(session);
        Storage.setCurrentSession(session.id);

        this.timeRemaining = 25 * 60;
        localStorage.setItem('timerRemaining', this.timeRemaining);
        this.goToScreen('studyTimer');
    },

    // ========== TIMER ==========
    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        this.updateTimerDisplay();

        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            localStorage.setItem('timerRemaining', this.timeRemaining);

            if (this.timeRemaining <= 0) {
                clearInterval(this.timerInterval);
                localStorage.removeItem('timerRemaining');
                this.endTimer();
            } else {
                this.updateTimerDisplay();
            }
        }, 1000);
    },

    updateTimerDisplay() {
        const display = document.getElementById('timerDisplay');
        if (!display) return;

        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        display.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },

    pauseTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        alert('Session paused. Press OK to resume or go back.');
        this.render();
    },

    endSessionEarly() {
        if (confirm('End session early and go to recall?')) {
            clearInterval(this.timerInterval);
            localStorage.removeItem('timerRemaining');
            this.goToScreen('recall');
        }
    },

    skipToRecall() {
        clearInterval(this.timerInterval);
        localStorage.removeItem('timerRemaining');
        this.goToScreen('recall');
    },

    endTimer() {
        clearInterval(this.timerInterval);
        localStorage.removeItem('timerRemaining');
        Audio.chimeSuccess();
        
        // Speak after alarm finishes (alarm is ~3.3 seconds, add buffer)
        setTimeout(() => {
            Audio.speak('Study complete, start recall');
        }, 4000);
        
        // Show completion message then navigate
        setTimeout(() => {
            this.showNotification('Study Complete, Start Recall');
            setTimeout(() => {
                this.goToScreen('recall');
            }, 1500);
        }, 4500);
    },

    showNotification(message) {
        const app = document.getElementById('app');
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%);
            color: white;
            padding: var(--spacing-lg);
            border-radius: 12px;
            font-size: 1.2rem;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            box-shadow: var(--shadow-lg);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 1200);
    },

    // ========== RECALL PHASE ==========
    saveRecallData() {
        const session = Storage.getCurrentSession();
        if (!session) return;

        const brainDump = document.getElementById('brainDump').value;
        const questions = session.targetQuestions.split('\n').filter(q => q.trim());
        const answers = {};

        questions.forEach((q, i) => {
            answers[i] = document.getElementById(`answer-${i}`)?.value || '';
        });

        // Save to session
        Storage.updateSession(session.id, {
            brainDump,
            answers,
        });
    },

    // ========== REFLECTION PHASE ==========
    saveReflection() {
        const session = Storage.getCurrentSession();
        if (!session) return;

        const hardest = document.getElementById('hardest').value;
        const missed = document.getElementById('missed').value;
        const nextQuestions = document.getElementById('nextQuestions').value;

        const reflection = {
            hardest,
            missed,
            nextQuestions,
        };

        // Save weak points for future recall
        const weakPoints = nextQuestions
            .split('\n')
            .filter(q => q.trim())
            .map(q => ({
                id: Date.now().toString() + Math.random(),
                topic: session.topic,
                question: q.trim(),
                completed: false,
                createdAt: new Date().toISOString(),
            }));

        Storage.addWeakPoints(weakPoints);
        Storage.updateSession(session.id, {
            reflection,
            status: 'completed',
        });
    },

    // ========== SESSION COMPLETION ==========
    completeSession() {
        Storage.incrementSessionCount();
        Audio.success();
        this.goToScreen('home');
    },

    copyWeakPointsToClipboard() {
        const session = Storage.getCurrentSession();
        if (!session || !session.reflection) return;

        const weakPointText = session.reflection.nextQuestions || '';
        const textToCopy = `Weak Points from "${session.topic}":\n\n${weakPointText}`;

        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('✅ Weak points copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('✅ Weak points copied to clipboard!');
        });
    },

    startNewSession() {
        this.goToScreen('createSession');
    },

    saveCurrentSession() {
        if (this.currentScreen === 'recall') {
            this.saveRecallData();
        }
    },

    // ========== QUICK RECALL ==========
    startQuickRecall() {
        this.goToScreen('quickRecall');
    },

    toggleSound() {
        Audio.toggle();
        this.render(); // Re-render to update the icon
    },

    testAlarm() {
        Audio.init();
        Audio.chimeSuccess();
        
        // Speak after alarm finishes (alarm is ~3.3 seconds, add buffer)
        setTimeout(() => {
            Audio.speak('Study complete, start recall');
        }, 4000);
        
        setTimeout(() => {
            this.showNotification('Study Complete, Start Recall');
        }, 4500);
    },

    completeWeakPoint() {
        const answer = document.getElementById('quickAnswer').value;
        if (!answer.trim()) {
            alert('Please write your answer');
            return;
        }

        const weakPoints = Storage.getWeakPoints();
        const firstIncomplete = weakPoints.find(p => !p.completed);
        if (firstIncomplete) {
            firstIncomplete.completed = true;
            Storage.saveWeakPoints(weakPoints);
        }

        const remaining = weakPoints.filter(p => !p.completed);
        if (remaining.length > 0) {
            this.render();
        } else {
            alert('All weak points reviewed!');
            this.goToScreen('home');
        }
    },

    skipWeakPoint() {
        // Just move to next
        const weakPoints = Storage.getWeakPoints();
        const firstIncomplete = weakPoints.find(p => !p.completed);
        if (firstIncomplete) {
            firstIncomplete.completed = true;
            Storage.saveWeakPoints(weakPoints);
        }

        const remaining = weakPoints.filter(p => !p.completed);
        if (remaining.length > 0) {
            this.render();
        } else {
            this.goToScreen('home');
        }
    }
};

// ========== INIT ON LOAD ==========
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
