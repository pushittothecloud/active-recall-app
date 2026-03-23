// ========================================
// REMINDERS – Calendar integration
// ========================================

const Reminders = {
    // Generate Google Calendar URL for a reminder
    generateCalendarLink(topic, daysFromNow, weakPointText = '') {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + daysFromNow);
        startDate.setHours(18, 0, 0, 0); // 6 PM
        
        const endDate = new Date(startDate);
        endDate.setHours(18, 30, 0, 0); // 30 min duration
        
        // Format dates for Google Calendar (YYYYMMDDTHHMMSS)
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}${month}${day}T${hours}${minutes}${seconds}`;
        };
        
        const start = formatDate(startDate);
        const end = formatDate(endDate);
        
        // Format weak points for title (first line only)
        const weakPointLines = weakPointText ? weakPointText.split('\n').filter(q => q.trim()) : [];
        const titleText = weakPointLines.length > 0 
            ? weakPointLines[0].substring(0, 50) 
            : topic;
        const title = `🧠 Recall: ${titleText}`;
        
        // Format weak points for description (all lines)
        const descriptionLines = weakPointText 
            ? `Weak points to review:\n\n${weakPointLines.map(q => `• ${q.trim()}`).join('\n')}` 
            : `Review weak points from: ${topic}`;
        const description = `${descriptionLines}\n\nReviewing just before you forget makes memories last much longer.`;
        
        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: title,
            dates: `${start}/${end}`,
            details: description,
            location: 'Active Recall Session'
        });
        
        return `https://calendar.google.com/calendar/render?${params.toString()}`;
    },

    // Create reminder events
    createReminders(topic, weakPoints) {
        const reminders = [];
        
        // Tomorrow
        if (document.getElementById('reviewTomorrow')?.checked) {
            reminders.push({
                days: 1,
                label: 'Tomorrow',
                url: this.generateCalendarLink(topic, 1, weakPoints)
            });
        }
        
        // 3 days
        if (document.getElementById('review3Days')?.checked) {
            reminders.push({
                days: 3,
                label: '3 Days',
                url: this.generateCalendarLink(topic, 3, weakPoints)
            });
        }
        
        // 1 week
        if (document.getElementById('review1Week')?.checked) {
            reminders.push({
                days: 7,
                label: '1 Week',
                url: this.generateCalendarLink(topic, 7, weakPoints)
            });
        }
        
        return reminders;
    },
    
    // Open Google Calendar in new window
    openCalendarLink(topic, daysFromNow, weakPointText = '') {
        const url = this.generateCalendarLink(topic, daysFromNow, weakPointText);
        window.open(url, '_blank');
    },

    // Set evening recall reminder
    setEveningRecallReminder() {
        // Get today's date and set time to 8 PM (or next morning if past 8 PM)
        const now = new Date();
        const reminderTime = new Date();
        reminderTime.setHours(20, 0, 0, 0); // 8 PM
        
        // If it's already past 8 PM, set for next morning at 9 AM instead
        if (now > reminderTime) {
            reminderTime.setDate(reminderTime.getDate() + 1);
            reminderTime.setHours(9, 0, 0, 0);
        }
        
        // Store reminder in localStorage
        const currentSession = Storage.getCurrentSession();
        if (currentSession) {
            const reminder = {
                sessionId: currentSession.id,
                setTime: new Date().toISOString(),
                reminderTime: reminderTime.toISOString(),
                completed: false
            };
            
            let reminders = JSON.parse(localStorage.getItem('eveningRecallReminders') || '[]');
            reminders.push(reminder);
            localStorage.setItem('eveningRecallReminders', JSON.stringify(reminders));
            
            // Show confirmation
            const timeStr = reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            alert(`✅ Reminder set for tonight at ${timeStr}\n\nYou'll recall what you learned before sleep—this is when long-term memory gets locked in.`);
        }
    }
};
