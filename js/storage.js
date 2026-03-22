// ========================================
// STORAGE – LocalStorage persistence
// ========================================

const Storage = {
    // Session management
    getSessions() {
        const data = localStorage.getItem('sessions');
        return data ? JSON.parse(data) : [];
    },

    saveSessions(sessions) {
        localStorage.setItem('sessions', JSON.stringify(sessions));
    },

    getOrCreateSession(id) {
        const sessions = this.getSessions();
        return sessions.find(s => s.id === id) || null;
    },

    createSession(session) {
        const sessions = this.getSessions();
        sessions.push(session);
        this.saveSessions(sessions);
        return session;
    },

    updateSession(id, updates) {
        const sessions = this.getSessions();
        const index = sessions.findIndex(s => s.id === id);
        if (index !== -1) {
            sessions[index] = { ...sessions[index], ...updates };
            this.saveSessions(sessions);
            return sessions[index];
        }
        return null;
    },

    // Current session
    getCurrentSession() {
        const id = localStorage.getItem('currentSessionId');
        return id ? this.getOrCreateSession(id) : null;
    },

    setCurrentSession(id) {
        localStorage.setItem('currentSessionId', id);
    },

    // Stats
    getStats() {
        const data = localStorage.getItem('stats');
        return data ? JSON.parse(data) : {
            sessionsCompleted: 0,
            totalStudyTime: 0,
        };
    },

    updateStats(updates) {
        const stats = this.getStats();
        const updated = { ...stats, ...updates };
        localStorage.setItem('stats', JSON.stringify(updated));
        return updated;
    },

    incrementSessionCount() {
        const stats = this.getStats();
        stats.sessionsCompleted += 1;
        this.updateStats(stats);
        return stats;
    },

    // Weak points
    getWeakPoints() {
        const data = localStorage.getItem('weakPoints');
        return data ? JSON.parse(data) : [];
    },

    saveWeakPoints(points) {
        localStorage.setItem('weakPoints', JSON.stringify(points));
    },

    addWeakPoints(newPoints) {
        const points = this.getWeakPoints();
        points.push(...newPoints);
        this.saveWeakPoints(points);
        return points;
    },

    // Clear all (for debugging)
    clearAll() {
        localStorage.clear();
    }
};
