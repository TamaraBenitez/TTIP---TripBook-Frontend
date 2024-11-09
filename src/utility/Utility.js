export const formatDate = (date, time) => {
    const dateObj = new Date(date);
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
        return "Invalid Date";
    }

    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString(undefined, dateOptions);

    let formattedTime = "";
    if (time) {
        const timeObj = new Date(time);

        // Check if time is valid
        if (isNaN(timeObj.getTime())) {
            return `${formattedDate} - Invalid Time`;
        }

        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        formattedTime = timeObj.toLocaleTimeString(undefined, timeOptions);
    }

    return `${formattedDate} ${formattedTime}`.trim();
};