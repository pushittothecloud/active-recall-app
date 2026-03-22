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
        
        const title = `Review: ${topic}`;
        const description = weakPointText 
            ? `Weak points to review:\n${weakPointText}` 
            : 'Recall what you studied earlier.';
        
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
    }
};
