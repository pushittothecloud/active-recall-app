// ========================================
// SCREENS – UI rendering functions
// ========================================

const Screens = {
    // ========== HOME ==========
    renderHome() {
        const stats = Storage.getStats();
        const weakPoints = Storage.getWeakPoints();
        const dueCount = Math.max(0, weakPoints.filter(p => !p.completed).length);
        const soundIcon = Audio.soundEnabled ? '🔊' : '🔇';

        return `
            <div class="home-container">
                <div style="position: absolute; top: var(--spacing-lg); right: var(--spacing-md); z-index: 10;">
                    <button 
                        class="btn btn-tertiary btn-small" 
                        onclick="App.toggleSound()"
                        title="Toggle sound effects"
                        style="width: auto; padding: var(--spacing-sm);"
                    >
                        ${soundIcon}
                    </button>
                </div>

                <div class="home-header">
                    <div class="home-title">🧠</div>
                    <h1 class="home-title">Active Recall</h1>
                    <p class="home-subtitle">Guided study through retrieval</p>
                </div>

                <div class="home-actions">
                    <div class="home-stats">
                        <div class="stat-number">${stats.sessionsCompleted}</div>
                        <div class="stat-label">Sessions completed</div>
                    </div>

                    ${dueCount > 0 ? `
                        <div class="card">
                            <div class="card-title">📋 ${dueCount} Recall Check${dueCount !== 1 ? 's' : ''} Due</div>
                            <button class="btn btn-secondary btn-small" onclick="App.startQuickRecall()">
                                Review Weak Points
                            </button>
                        </div>
                    ` : ''}

                    <button class="btn btn-primary" onclick="App.goToScreen('createSession')">
                        ▶ Start New Session
                    </button>

                    ${stats.sessionsCompleted > 0 ? `
                        <button class="btn btn-secondary" onclick="App.goToScreen('history')">
                            📚 View Sessions
                        </button>
                    ` : ''}

                    <!-- Science Principles -->
                    <div style="background: var(--card-bg); border-radius: 12px; padding: var(--spacing-lg); border: 1px solid var(--border-light); box-shadow: var(--shadow-sm);">
                        <div style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: var(--spacing-md); font-weight: 600;">🧠 Why This Works</div>
                        <div style="display: flex; flex-direction: column; gap: var(--spacing-md); font-size: 0.9rem; color: var(--text-dark); line-height: 1.6;">
                            <div>
                                <strong style="color: var(--primary);">Recalling</strong> strengthens memory more than rereading—even if you get it wrong.
                            </div>
                            <div>
                                <strong style="color: var(--primary);">Struggle</strong> improves retention. If it feels hard, you'll remember better.
                            </div>
                            <div>
                                <strong style="color: var(--primary);">Spacing</strong> matters. You'll revisit weak points later to lock them in.
                            </div>
                        </div>
                    </div>
                </div>

                <div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding-bottom: var(--spacing-lg);">
                    <p>Study sessions are saved locally on this device</p>
                </div>
            </div>
        `;
    },

    // ========== CREATE SESSION ==========
    renderCreateSession() {
        return `
            <div class="screen">
                <div class="screen-header">
                    <h1 class="screen-title">Start Session</h1>
                    <p class="screen-subtitle">Prime your brain for learning</p>
                </div>

                <div id="sessionForm">
                    <!-- Step 1: Topic -->
                    <div class="form-group" id="stepTopic">
                        <label class="form-label">What are you studying?</label>
                        <input 
                            type="text" 
                            class="form-input" 
                            id="topic" 
                            placeholder="e.g., Photosynthesis, React Hooks, Medieval History"
                            autocomplete="off"
                        />
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: var(--spacing-xs);">Press Enter to continue</div>
                        <button class="btn btn-primary" onclick="App.nextStep('stepTopic')">Continue</button>
                    </div>

                    <!-- Step 2: Prior Knowledge -->
                    <div class="form-group hidden" id="stepKnowledge">
                        <label class="form-label">What do you already know?</label>
                        <p class="form-hint">Even a rough idea helps activate your memory</p>
                        <textarea 
                            class="form-textarea" 
                            id="priorKnowledge" 
                            placeholder="Jot down what comes to mind..."
                        ></textarea>
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: var(--spacing-xs);">Press Enter to continue</div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-tertiary" onclick="App.prevStep()">Back</button>
                            <button class="btn btn-primary" onclick="App.nextStep('stepKnowledge')" style="flex: 2;">Continue</button>
                        </div>
                    </div>

                    <!-- Step 3: Target Questions -->
                    <div class="form-group hidden" id="stepQuestions">
                        <label class="form-label">Write 3–5 questions you want to answer</label>
                        <p class="form-hint">These are your retrieval targets</p>
                        <textarea 
                            class="form-textarea" 
                            id="targetQuestions" 
                            placeholder="Examples:&#10;- Explain how photosynthesis works&#10;- What are the steps?&#10;- Why does this matter?"
                        ></textarea>
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: var(--spacing-xs);">Press Enter to continue</div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-tertiary" onclick="App.prevStep()">Back</button>
                            <button class="btn btn-primary" onclick="App.nextStep('stepQuestions')" style="flex: 2;">Continue</button>
                        </div>
                    </div>

                    <!-- Step 4: Difficulty Prediction -->
                    <div class="form-group hidden" id="stepDifficulty">
                        <label class="form-label">What will be hardest?</label>
                        <p class="form-hint">This helps you focus on weak spots</p>
                        <textarea 
                            class="form-textarea" 
                            id="predictedDifficulty" 
                            placeholder="What might trip you up? What's confusing?"
                        ></textarea>
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: var(--spacing-xs);">Press Enter to start</div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-tertiary" onclick="App.prevStep()">Back</button>
                            <button class="btn btn-primary" onclick="App.startStudyTimer()" style="flex: 2;">Start Studying</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // ========== STUDY TIMER ==========
    renderStudyTimer() {
        const session = Storage.getCurrentSession();
        const questions = session.targetQuestions.split('\n').filter(q => q.trim());

        return `
            <div class="screen" style="justify-content: space-between; padding-bottom: var(--spacing-lg);">
                <div>
                    <div class="timer-label">Study Time</div>
                    <div class="timer-display" id="timerDisplay">25:00</div>
                </div>

                <!-- Target Questions Card -->
                <div class="card">
                    <div class="card-title">Your Questions</div>
                    <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
                        ${questions.map((q, i) => `
                            <div style="font-size: 0.95rem; color: var(--text-muted); padding-left: var(--spacing-sm); border-left: 3px solid var(--accent);">
                                ${q}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Science Tips (Always Visible) -->
                <div style="background: var(--light-bg); border-radius: 12px; padding: var(--spacing-md); border-left: 4px solid var(--primary);">
                    <div style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: var(--spacing-sm); font-weight: 600;">💡 How Recall Works</div>
                    <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); font-size: 0.9rem; color: var(--text-dark); line-height: 1.5;">
                        <div>✓ Trying to recall strengthens memory more than rereading</div>
                        <div>✓ The harder you struggle, the better it sticks</div>
                        <div>✓ Getting it wrong builds better memory than easy reading</div>
                        <div>✓ You'll revisit these later to lock them in</div>
                    </div>
                </div>

                <div class="timer-controls">
                    <button class="btn btn-tertiary" onclick="App.pauseTimer()">⏸ Pause</button>
                    <button class="btn btn-tertiary" onclick="App.endSessionEarly()">⊗ End</button>
                    <button class="btn btn-tertiary" style="font-size: 0.8rem; padding: 0.75rem;" title="Skip to recall (testing)" onclick="App.skipToRecall()">→ Recall</button>
                </div>
            </div>
        `;
    },

    // ========== RECALL PHASE ==========
    renderRecall() {
        const session = Storage.getCurrentSession();
        const questions = session.targetQuestions.split('\n').filter(q => q.trim());

        return `
            <div class="screen">
                <div class="recall-header">
                    <div class="recall-header-title">NO NOTES</div>
                    <p style="margin-top: var(--spacing-xs); font-size: 0.9rem;">Recall from memory only</p>
                </div>

                <div class="recall-section">
                    <label class="recall-label">Brain Dump</label>
                    <p class="screen-subtitle" style="margin-bottom: var(--spacing-md);">Write everything you remember</p>
                    <textarea 
                        class="form-textarea" 
                        id="brainDump" 
                        placeholder="Let it all out. Don't worry about organization or perfection."
                        style="min-height: 150px;"
                    ></textarea>
                </div>

                <div class="recall-section">
                    <label class="recall-label">Your Questions (from memory)</label>
                    <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                        ${questions.map((q, i) => `
                            <div>
                                <div style="font-weight: 500; margin-bottom: var(--spacing-sm); color: var(--text-dark);">${q}</div>
                                <textarea 
                                    class="form-textarea recall-answer" 
                                    id="answer-${i}"
                                    placeholder="Answer from memory..."
                                    style="min-height: 80px;"
                                ></textarea>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <button class="btn btn-primary mt-auto" onclick="App.goToScreen('reflection')">
                    Continue to Reflection
                </button>
            </div>
        `;
    },

    // ========== REFLECTION ==========
    renderReflection() {
        return `
            <div class="screen">
                <div class="screen-header">
                    <h1 class="screen-title">Reflect</h1>
                    <p class="screen-subtitle">Turn mistakes into future questions</p>
                </div>

                <div class="reflection-item">
                    <div class="reflection-prompt">What was hardest to remember?</div>
                    <textarea 
                        id="hardest" 
                        class="reflection-input" 
                        placeholder="Which parts did you forget or mix up?"
                    ></textarea>
                </div>

                <div class="reflection-item">
                    <div class="reflection-prompt">What did you miss or misunderstand?</div>
                    <textarea 
                        id="missed" 
                        class="reflection-input" 
                        placeholder="What was wrong or incomplete?"
                    ></textarea>
                </div>

                <div class="reflection-item">
                    <div class="reflection-prompt">Turn 2–3 weak points into questions for next time</div>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: var(--spacing-sm);">
                        Examples: "What are the steps?" "Why does X happen?" "Define Y"
                    </p>
                    <textarea 
                        id="nextQuestions" 
                        class="reflection-input" 
                        placeholder="- &#10;- &#10;-"
                    ></textarea>
                </div>

                <button class="btn btn-primary" onclick="App.goToScreen('saveSession')">
                    Finish Session
                </button>
            </div>
        `;
    },

    // ========== SAVE SESSION ==========
    renderSaveSession() {
        const session = Storage.getCurrentSession();
        const weakPointText = session.reflection?.nextQuestions || 'Weak points from this session';
        
        return `
            <div class="screen">
                <div class="screen-header">
                    <h1 class="screen-title">✓ Done!</h1>
                    <p class="screen-subtitle">Your session has been saved</p>
                </div>

                <div class="card mb-xl">
                    <div class="card-title">📝 Weak Points Saved</div>
                    <p class="card-text">You'll be reminded to revisit these</p>
                </div>

                <div class="card mb-xl">
                    <div class="card-title">📅 Add Reminders to Calendar</div>
                    <div style="display: flex; flex-direction: column; gap: var(--spacing-md); margin-top: var(--spacing-md);">
                        <div>
                            <label style="display: flex; align-items: center; gap: var(--spacing-sm); margin-bottom: var(--spacing-sm); font-weight: 500;">
                                <input type="checkbox" id="reviewTomorrow" checked>
                                Tomorrow
                            </label>
                            <button class="btn btn-secondary btn-small" onclick="Reminders.openCalendarLink('${session.topic}', 1, '${weakPointText.replace(/'/g, "\\'")}')">
                                + Add to Google Calendar
                            </button>
                        </div>
                        <div>
                            <label style="display: flex; align-items: center; gap: var(--spacing-sm); margin-bottom: var(--spacing-sm); font-weight: 500;">
                                <input type="checkbox" id="review3Days" checked>
                                3 Days
                            </label>
                            <button class="btn btn-secondary btn-small" onclick="Reminders.openCalendarLink('${session.topic}', 3, '${weakPointText.replace(/'/g, "\\'")}')">
                                + Add to Google Calendar
                            </button>
                        </div>
                        <div>
                            <label style="display: flex; align-items: center; gap: var(--spacing-sm); margin-bottom: var(--spacing-sm); font-weight: 500;">
                                <input type="checkbox" id="review1Week" checked>
                                1 Week
                            </label>
                            <button class="btn btn-secondary btn-small" onclick="Reminders.openCalendarLink('${session.topic}', 7, '${weakPointText.replace(/'/g, "\\'")}')">
                                + Add to Google Calendar
                            </button>
                        </div>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: var(--spacing-md); font-style: italic;">
                        Click to open Google Calendar. (Or just save—weak points are stored locally)
                    </p>
                </div>

                <div style="flex: 1;"></div>

                <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                    <button class="btn btn-primary" onclick="App.completeSession()">
                        ✓ Save & Return Home
                    </button>
                    <button class="btn btn-secondary" onclick="App.startNewSession()">
                        ▶ Start Another Session
                    </button>
                </div>
            </div>
        `;
    },

    // ========== QUICK RECALL ==========
    renderQuickRecall() {
        const weakPoints = Storage.getWeakPoints().filter(p => !p.completed);
        if (weakPoints.length === 0) {
            return `
                <div class="screen text-center" style="justify-content: center;">
                    <p style="color: var(--text-muted);">No weak points to review right now</p>
                    <button class="btn btn-primary mt-auto" onclick="App.goToScreen('home')">
                        Back Home
                    </button>
                </div>
            `;
        }

        const point = weakPoints[0];
        return `
            <div class="screen">
                <div class="screen-header">
                    <h1 class="screen-title">Quick Recall</h1>
                    <p class="screen-subtitle">From ${point.topic}</p>
                </div>

                <div class="card mb-xl">
                    <p class="card-text" style="font-size: 1.1rem;">${point.question}</p>
                </div>

                <textarea 
                    id="quickAnswer" 
                    class="form-textarea" 
                    placeholder="Answer from memory..."
                    style="min-height: 150px;"
                ></textarea>

                <div style="display: flex; gap: var(--spacing-sm);">
                    <button class="btn btn-tertiary" onclick="App.skipWeakPoint()">Skip</button>
                    <button class="btn btn-primary" onclick="App.completeWeakPoint()">✓ Done</button>
                </div>
            </div>
        `;
    }
};
