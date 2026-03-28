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

                    <!-- What is Active Recall? -->
                    <div style="background: linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%); color: white; border-radius: 12px; padding: var(--spacing-lg); box-shadow: var(--shadow-sm);">
                        <div style="font-size: 0.85rem; color: rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: var(--spacing-sm); font-weight: 600;">What is Active Recall?</div>
                        <p style="margin: 0 0 var(--spacing-sm) 0; font-size: 0.95rem; line-height: 1.6;">
                            <strong>Active Recall</strong> means testing yourself on what you learned, without looking at the material. Instead of rereading notes, you force your brain to retrieve the information—which makes it stick far better.
                        </p>
                        <div style="background: rgba(255,255,255,0.15); padding: var(--spacing-sm); border-radius: 8px; margin-top: var(--spacing-sm); font-size: 0.85rem;">
                            <div style="margin-bottom: 0.5rem;">❌ <strong>Passive:</strong> Read notes → highlight → reread</div>
                            <div>✅ <strong>Active:</strong> Study → hide notes → write from memory → check answers</div>
                        </div>
                        <div style="margin-top: var(--spacing-md); font-size: 0.9rem; border-left: 3px solid rgba(255,255,255,0.5); padding-left: var(--spacing-sm);">
                            <strong>The result:</strong> Active recall learners retain information 50–150% better than passive readers—not because they're smarter, but because their brain is working harder.
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
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <label class="form-label" style="margin: 0;">Write 3–5 questions you want to answer</label>
                            <div class="tooltip-wrapper">
                                <span class="tooltip-icon">?</span>
                                <span class="tooltip-text">Writing questions improves learning (+10–25%)<br><br>Answering or even guessing questions before studying improves later memory.<br><br>— Roediger & Karpicke (2006)</span>
                            </div>
                        </div>
                        <p class="form-hint">These are your retrieval targets</p>
                        <textarea 
                            class="form-textarea" 
                            id="targetQuestions" 
                            placeholder="Examples:&#10;- Explain how photosynthesis works&#10;- What are the steps?&#10;- Why does this matter?"
                        ></textarea>
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: var(--spacing-xs);">Press Tab to move to next field</div>
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
            <div class="screen">
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

                <!-- Study Tips Section -->
                <div style="border: 1px solid var(--border-light); border-radius: 12px; background: var(--card-bg);">
                    <button 
                        onclick="const content = this.nextElementSibling; const isOpen = content.style.display !== 'none'; content.style.display = isOpen ? 'none' : 'block'; this.querySelector('.toggle-icon').style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';"
                        style="width: 100%; padding: var(--spacing-md); border: none; background: none; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: var(--text-dark);"
                    >
                        <span>🔍 Study Tips (Finding Answers)</span>
                        <span class="toggle-icon" style="margin-left: auto; transition: transform 0.2s; display: inline-block;">▼</span>
                    </button>
                    <div style="display: none; padding: var(--spacing-md); font-size: 0.9rem; color: var(--text-dark);">
                        <!-- Do's Section -->
                        <div style="margin-bottom: var(--spacing-lg);">
                            <div style="font-weight: 600; color: var(--primary); margin-bottom: var(--spacing-md); font-size: 1rem;">✅ What to do</div>
                            
                            <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                                <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: var(--spacing-sm); border-bottom: 1px solid var(--border-light);">
                                    <span>Start with reading (not just watching)</span>
                                    <span style="color: var(--accent); font-weight: 600; font-size: 0.95rem;">+20–40%</span>
                                </div>
                                <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: var(--spacing-sm); border-bottom: 1px solid var(--border-light);">
                                    <span>Search in good sources first</span>
                                    <span style="color: var(--accent); font-weight: 600; font-size: 0.95rem;">+15–30%</span>
                                </div>
                                <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: var(--spacing-sm); border-bottom: 1px solid var(--border-light);">
                                    <span>Read actively (engage with text)</span>
                                    <span style="color: var(--accent); font-weight: 600; font-size: 0.95rem;">+30–60%</span>
                                </div>
                                <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: var(--spacing-sm); border-bottom: 1px solid var(--border-light);">
                                    <span>Pause and think before moving on</span>
                                    <span style="color: var(--accent); font-weight: 600; font-size: 0.95rem;">+25–50%</span>
                                </div>
                                <div style="display: flex; align-items: center; justify-content: space-between;">
                                    <span>Use multiple sources if stuck</span>
                                    <span style="color: var(--accent); font-weight: 600; font-size: 0.95rem;">+15–35%</span>
                                </div>
                            </div>
                        </div>

                        <!-- Don'ts Section -->
                        <div style="padding-top: var(--spacing-md); border-top: 1px solid var(--border-light);">
                            <div style="font-weight: 600; color: var(--primary); margin-bottom: var(--spacing-md); font-size: 1rem;">❌ What to avoid</div>
                            
                            <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                                <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: var(--spacing-sm); border-bottom: 1px solid var(--border-light);">
                                    <span>Watch videos passively start-to-finish</span>
                                    <span style="color: var(--error, #ff6b6b); font-weight: 600; font-size: 0.95rem;">−20–50%</span>
                                </div>
                                <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: var(--spacing-sm); border-bottom: 1px solid var(--border-light);">
                                    <span>Scroll aimlessly without a goal</span>
                                    <span style="color: var(--error, #ff6b6b); font-weight: 600; font-size: 0.95rem;">−20–40%</span>
                                </div>
                                <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: var(--spacing-sm); border-bottom: 1px solid var(--border-light);">
                                    <span>Rely on only one source</span>
                                    <span style="color: var(--error, #ff6b6b); font-weight: 600; font-size: 0.95rem;">−15–30%</span>
                                </div>
                                <div style="display: flex; align-items: center; justify-content: space-between;">
                                    <span>Multitask while searching</span>
                                    <span style="color: var(--error, #ff6b6b); font-weight: 600; font-size: 0.95rem;">−10–30%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="timer-controls" style="margin-top: auto;">
                    <button class="btn btn-tertiary" onclick="App.endSessionEarly()">⊗ End</button>
                    <button class="btn btn-tertiary" onclick="App.skipToRecall()">→ Recall</button>
                    <button class="btn btn-tertiary" onclick="App.testAlarm()">🔔 Test Alarm</button>
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
                <div style="background: linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%); color: white; padding: var(--spacing-lg); border-radius: 12px; margin-bottom: var(--spacing-lg);">
                    <div style="font-weight: 700; margin-bottom: 0.5rem;">💭 This is the most important step</div>
                    <div style="font-size: 0.95rem;">Memory boost: <strong>+50–150%</strong></div>
                    <div style="font-size: 0.85rem; margin-top: 0.5rem; opacity: 0.95;">Actively recalling information strengthens memory far more than re-reading. — Roediger & Karpicke (2006), Karpicke & Blunt (2011)</div>
                </div>

                <div class="recall-header">
                    <div class="recall-header-title">NO NOTES</div>
                    <p style="margin-top: var(--spacing-xs); font-size: 0.9rem;">Recall from memory only</p>
                </div>

                <div class="recall-section">
                    <label class="recall-label">Brain Dump</label>
                    <p class="screen-subtitle" style="margin-bottom: var(--spacing-md);">Write everything you remember</p>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <span style="font-size: 0.85rem; color: var(--accent); font-weight: 600;">Struggling improves retention (+20–40%) ⓘ</span>
                        <div class="tooltip-wrapper" style="margin: 0;">
                            <span class="tooltip-icon">?</span>
                            <span class="tooltip-text">More effortful retrieval leads to stronger long-term memory.<br><br>— Bjork (Desirable Difficulties)</span>
                        </div>
                    </div>
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
        const weakPoints = Storage.getWeakPoints();
        const hasWeakPoints = weakPoints.length > 0;
        
        return `
            <div class="screen">
                <div class="screen-header">
                    <h1 class="screen-title">Reflect</h1>
                    <p class="screen-subtitle">Turn mistakes into future questions</p>
                </div>

                <div class="reflection-item">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="reflection-prompt" style="margin: 0;">What was hardest to remember?</div>
                        <div class="tooltip-wrapper">
                            <span class="tooltip-icon">?</span>
                            <span class="tooltip-text">Identify gaps in your knowledge (+10–25%)<br><br>Reflecting on errors and correcting misunderstandings improves learning.<br><br>— Metacognition research (Dunlosky et al., 2013)</span>
                        </div>
                    </div>
                    <textarea 
                        id="hardest" 
                        class="reflection-input" 
                        placeholder="Which parts did you forget or mix up?"
                    ></textarea>
                </div>

                <div class="reflection-item">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="reflection-prompt" style="margin: 0;">What did you miss or misunderstand?</div>
                        <div class="tooltip-wrapper">
                            <span class="tooltip-icon">?</span>
                            <span class="tooltip-text">Identify gaps in your knowledge (+10–25%)<br><br>Reflecting on errors and correcting misunderstandings improves learning.<br><br>— Metacognition research (Dunlosky et al., 2013)</span>
                        </div>
                    </div>
                    <textarea 
                        id="missed" 
                        class="reflection-input" 
                        placeholder="What was wrong or incomplete?"
                    ></textarea>
                </div>

                <div class="reflection-item">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="reflection-prompt" style="margin: 0;">Turn 2–3 weak points into questions for next time</div>
                        <div class="tooltip-wrapper">
                            <span class="tooltip-icon">?</span>
                            <span class="tooltip-text">Turn gaps into questions (+15–30%)<br><br>Generating your own questions strengthens understanding and memory.<br><br>— Generation effect / elaborative interrogation</span>
                        </div>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: var(--spacing-sm);">
                        Examples: "What are the steps?" "Why does X happen?" "Define Y"
                    </p>
                    
                    ${hasWeakPoints ? `
                        <div style="margin-bottom: var(--spacing-md);">
                            <button 
                                type="button"
                                class="btn btn-tertiary btn-small" 
                                onclick="this.parentElement.querySelector('.prev-weak-points').style.display = this.parentElement.querySelector('.prev-weak-points').style.display === 'none' ? 'block' : 'none'; this.textContent = (this.textContent.includes('Show') ? 'Hide' : 'Show') + ' previous weak points'"
                                style="width: 100%; text-align: left; padding: var(--spacing-sm) var(--spacing-md);"
                            >
                                Show previous weak points (${weakPoints.length})
                            </button>
                            <div class="prev-weak-points" style="display: none; background: var(--light-bg); border-radius: 12px; padding: var(--spacing-md); margin-top: var(--spacing-sm); border-left: 4px solid var(--accent); max-height: 200px; overflow-y: auto;">
                                ${weakPoints.map(point => `
                                    <div style="padding: var(--spacing-sm); border-bottom: 1px solid var(--border-light); font-size: 0.9rem;">
                                        <strong style="color: var(--primary);">From ${point.topic}:</strong>
                                        <div style="color: var(--text-dark); margin-top: 0.25rem;">${point.question}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <textarea 
                        id="nextQuestions" 
                        class="reflection-input" 
                        placeholder="- &#10;- &#10;-"
                    ></textarea>
                </div>

                <button class="btn btn-primary" onclick="App.saveReflection(); App.goToScreen('celebration')">
                    Finish Session
                </button>
            </div>
        `;
    },

    // ========== CELEBRATION ==========
    renderCelebration() {
        // Trigger celebratory effects
        setTimeout(() => Audio.celebration(), 100);
        this.createConfetti();
        
        return `
            <div class="screen celebration-screen">
                <div class="confetti-container" id="confettiContainer"></div>
                
                <div style="text-align: center; margin-top: 3rem; margin-bottom: 2rem;">
                    <div style="font-size: 5rem; margin-bottom: 1rem; animation: celebrate-pop 0.6s ease-out;">
                        🎉
                    </div>
                    <h1 class="screen-title" style="font-size: 2rem; margin-bottom: 0.5rem;">Nailed it!</h1>
                    <p class="screen-subtitle" style="font-size: 1.1rem;">You did the hard part. Now lock it in.</p>
                </div>

                <div style="display: flex; flex-direction: column; gap: var(--spacing-md); margin-bottom: 2rem;">
                    
                    <!-- Reward Section -->
                    <div class="celebration-expandable" onclick="Screens.toggleCelebrationSection(this)" style="cursor: pointer;">
                        <div class="celebration-header">
                            <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1;">
                                <span style="font-size: 1.5rem;">🎉</span>
                                <div style="text-align: left;">
                                    <div style="font-size: 1.1rem; font-weight: 600; color: var(--text-dark);">Reward yourself</div>
                                    <div style="font-size: 0.9rem; color: var(--accent); font-weight: 600;">Memory boost +5–15%</div>
                                </div>
                            </div>
                            <span style="font-size: 1.2rem; transition: transform 0.3s;" class="toggle-icon">▼</span>
                        </div>
                        <div class="celebration-content" style="display: none;">
                            <div style="display: flex; flex-wrap: wrap; gap: var(--spacing-sm); margin-bottom: 1rem;">
                                <button class="btn btn-tertiary btn-small" onclick="App.handleCelebrationAction('song'); event.stopPropagation();">🎵 Play song</button>
                                <button class="btn btn-tertiary btn-small" onclick="App.handleCelebrationAction('snack'); event.stopPropagation();">🍕 Grab snack</button>
                                <button class="btn btn-tertiary btn-small" onclick="App.handleCelebrationAction('stretch'); event.stopPropagation();">🤸 Stretch</button>
                            </div>
                            <div style="font-size: 0.85rem; color: var(--text-muted); background: var(--light-bg); padding: 1rem; border-radius: 8px; border-left: 3px solid var(--accent);">
                                <p style="margin: 0 0 0.5rem 0; line-height: 1.5;">
                                    Positive emotion and reward signals activate dopamine pathways that strengthen memory consolidation during sleep.
                                </p>
                                <p style="margin: 0; font-size: 0.8rem; color: var(--text-muted); font-style: italic;">
                                    LaBar & Cabeza (2006): The role of emotion in forming long-term memories
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Relax Section -->
                    <div class="celebration-expandable" onclick="Screens.toggleCelebrationSection(this)" style="cursor: pointer;">
                        <div class="celebration-header">
                            <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1;">
                                <span style="font-size: 1.5rem;">🧘</span>
                                <div style="text-align: left;">
                                    <div style="font-size: 1.1rem; font-weight: 600; color: var(--text-dark);">Relax</div>
                                    <div style="font-size: 0.9rem; color: var(--accent); font-weight: 600;">Memory boost +10–20%</div>
                                </div>
                            </div>
                            <span style="font-size: 1.2rem; transition: transform 0.3s;" class="toggle-icon">▼</span>
                        </div>
                        <div class="celebration-content" style="display: none;">
                            <div style="display: flex; flex-wrap: wrap; gap: var(--spacing-sm); margin-bottom: 1rem;">
                                <button class="btn btn-tertiary btn-small" onclick="App.handleCelebrationAction('quiet'); event.stopPropagation();">🪑 Sit quietly</button>
                                <button class="btn btn-tertiary btn-small" onclick="App.handleCelebrationAction('walk'); event.stopPropagation();">🚶 Take a walk</button>
                                <button class="btn btn-tertiary btn-small" onclick="App.handleCelebrationAction('breathe'); event.stopPropagation();">😌 Breathe</button>
                            </div>
                            <div style="font-size: 0.85rem; color: var(--text-muted); background: var(--light-bg); padding: 1rem; border-radius: 8px; border-left: 3px solid var(--accent);">
                                <p style="margin: 0 0 0.5rem 0; line-height: 1.5;">
                                    Rest and quiet wakefulness allow your brain to replay and consolidate memories. Avoiding new information during this period maximizes consolidation.
                                </p>
                                <p style="margin: 0; font-size: 0.8rem; color: var(--text-muted); font-style: italic;">
                                    Born et al. (2006): Sleep to remember • Walker & Stickgold (2006): Sleep, memory consolidation
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Review Section -->
                    <div class="celebration-expandable" onclick="Screens.toggleCelebrationSection(this)" style="cursor: pointer; background: linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%);">
                        <div class="celebration-header" style="color: white;">
                            <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1;">
                                <span style="font-size: 1.5rem;">🌙</span>
                                <div style="text-align: left;">
                                    <div style="font-size: 1.1rem; font-weight: 700; color: white;">Review tonight</div>
                                    <div style="font-size: 0.95rem; color: rgba(255,255,255,0.9); font-weight: 600;">Memory boost +20–40%</div>
                                </div>
                            </div>
                            <span style="font-size: 1.2rem; transition: transform 0.3s; color: white;" class="toggle-icon">▼</span>
                        </div>
                        <div class="celebration-content" style="display: none;">
                            <div style="margin-bottom: 1rem;">
                                <button class="btn btn-secondary" onclick="Reminders.setEveningRecallReminder(); event.stopPropagation();">
                                    ⏰ Set reminder to recall
                                </button>
                            </div>
                            <div style="font-size: 0.85rem; color: var(--text-muted); background: white; padding: 1rem; border-radius: 8px; border-left: 3px solid var(--accent);">
                                <p style="margin: 0 0 0.5rem 0; line-height: 1.5;">
                                    Retrieving memories before sleep increases consolidation. A single quick recall session hours before sleep increases long-term retention dramatically.
                                </p>
                                <p style="margin: 0; font-size: 0.8rem; color: var(--text-muted); font-style: italic;">
                                    Cepeda et al. (2006) • Walker & Stickgold (2006)
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); padding-top: var(--spacing-md);">
                    <button class="btn btn-primary" onclick="App.goToScreen('saveSession')">
                        Continue to Reminders
                    </button>
                    <button class="btn btn-secondary" onclick="App.goToScreen('home')">
                        Skip & Go Home
                    </button>
                </div>
            </div>
        `;
    },

    // Toggle celebration section expansion
    toggleCelebrationSection(element) {
        const content = element.querySelector('.celebration-content');
        const icon = element.querySelector('.toggle-icon');
        const isHidden = content.style.display === 'none';
        
        content.style.display = isHidden ? 'block' : 'none';
        icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
    },

    // Helper to create confetti effect
    createConfetti() {
        setTimeout(() => {
            const container = document.getElementById('confettiContainer');
            if (!container) return;
            
            const confettiPieces = 50;
            const emojis = ['🎉', '⭐', '✨', '🌟', '💫', '🎊'];
            
            for (let i = 0; i < confettiPieces; i++) {
                const piece = document.createElement('div');
                piece.className = 'confetti';
                piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                piece.style.left = Math.random() * 100 + '%';
                piece.style.animationDelay = (Math.random() * 0.5) + 's';
                piece.style.animationDuration = (2 + Math.random() * 2) + 's';
                container.appendChild(piece);
            }
        }, 50);
    },

    // ========== SAVE SESSION ==========
    renderSaveSession() {
        const session = Storage.getCurrentSession();
        const weakPointText = session.reflection?.nextQuestions || 'Weak points from this session';
        const weakPointLines = weakPointText.split('\n').filter(q => q.trim());
        
        return `
            <div class="screen">
                <div class="screen-header">
                    <h1 class="screen-title">✓ Done!</h1>
                    <p class="screen-subtitle">Your session has been saved</p>
                </div>

                <div class="card mb-xl">
                    <div class="card-title">📝 Weak Points Saved</div>
                    <p class="card-text">You'll be reminded to revisit these</p>
                    ${weakPointLines.length > 0 ? `
                        <div style="margin-top: var(--spacing-md); background: var(--light-bg); border-radius: 8px; padding: var(--spacing-md); border-left: 4px solid var(--accent); max-height: 200px; overflow-y: auto;">
                            ${weakPointLines.map(point => `
                                <div style="padding: var(--spacing-sm) 0; font-size: 0.9rem; color: var(--text-dark); border-bottom: 1px solid var(--border-light);">
                                    • ${point.trim()}
                                </div>
                            `).join('')}
                        </div>
                        <button class="btn btn-tertiary btn-small" onclick="App.copyWeakPointsToClipboard()" style="width: 100%; margin-top: var(--spacing-md);">
                            📋 Copy to Clipboard
                        </button>
                    ` : ''}
                </div>

                <div class="card mb-xl">
                    <div class="card-title" style="display: flex; align-items: center;">
                        📅 Add Reminders to Calendar
                        <div class="tooltip-wrapper" style="margin-left: auto;">
                            <span class="tooltip-icon">?</span>
                            <span class="tooltip-text">Reviewing just before you forget makes memories last much longer.</span>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: var(--spacing-md); margin-top: var(--spacing-md);">
                        <div>
                            <label style="display: flex; align-items: center; gap: var(--spacing-sm); margin-bottom: var(--spacing-sm); font-weight: 500;">
                                <input type="checkbox" id="reviewTomorrow" checked>
                                <span style="flex: 1;">Tomorrow — Reduce forgetting (+20–40%)</span>
                                <div class="tooltip-wrapper">
                                    <span class="tooltip-icon" style="margin: 0;">?</span>
                                    <span class="tooltip-text">Reviewing soon after learning interrupts forgetting.<br><br>— Cepeda et al. (2006)</span>
                                </div>
                            </label>
                            <button class="btn btn-secondary btn-small" onclick="Reminders.openCalendarLink('${session.topic}', 1, '${weakPointText.replace(/'/g, "\\'")}')">
                                + Add to Google Calendar
                            </button>
                        </div>
                        <div>
                            <label style="display: flex; align-items: center; gap: var(--spacing-sm); margin-bottom: var(--spacing-sm); font-weight: 500;">
                                <input type="checkbox" id="review3Days" checked>
                                <span style="flex: 1;">3 Days — Strengthen memory (+30–60%)</span>
                                <div class="tooltip-wrapper">
                                    <span class="tooltip-icon" style="margin: 0;">?</span>
                                    <span class="tooltip-text">Spaced repetition improves long-term retention.<br><br>— Cepeda et al. (2006)</span>
                                </div>
                            </label>
                            <button class="btn btn-secondary btn-small" onclick="Reminders.openCalendarLink('${session.topic}', 3, '${weakPointText.replace(/'/g, "\\'")}')">
                                + Add to Google Calendar
                            </button>
                        </div>
                        <div>
                            <label style="display: flex; align-items: center; gap: var(--spacing-sm); margin-bottom: var(--spacing-sm); font-weight: 500;">
                                <input type="checkbox" id="review1Week" checked>
                                <span style="flex: 1;">1 Week — Lock in long-term retention (+50–100%)</span>
                                <div class="tooltip-wrapper">
                                    <span class="tooltip-icon" style="margin: 0;">?</span>
                                    <span class="tooltip-text">Longer spacing intervals maximize long-term memory consolidation.<br><br>— Cepeda et al. (2006)</span>
                                </div>
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
