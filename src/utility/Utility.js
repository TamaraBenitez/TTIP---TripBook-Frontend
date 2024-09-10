export const formatDate = (date, time) => {
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(date).toLocaleDateString(undefined, dateOptions);
    var formattedTime = "";
    if(time){
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        formattedTime  = new Date(date).toLocaleTimeString(undefined, timeOptions);
    }
    
    return `${formattedDate} ${formattedTime}`;
  };