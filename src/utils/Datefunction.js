const getFormattedDate =(date)=>{
    // Replace this with your posted date in ISO format
 const postedDate = new Date(date);

 // Get the current date and time
 const currentDate = new Date();

 // Calculate the time difference in milliseconds
 const timeDifference = currentDate - postedDate;

 // Define time intervals in milliseconds
 const minute = 60 * 1000;
 const hour = 60 * minute;
 const day = 24 * hour;

 // Initialize the formatted date variable
 let formattedDate;

 if (timeDifference < minute) {
   // Less than a minute ago
   formattedDate = 'just now';
 } else if (timeDifference < hour) {
   // X minutes ago
   const minutesAgo = Math.floor(timeDifference / minute);
   formattedDate = `${minutesAgo} mins ago`;
 } else if (timeDifference < 2 * hour) {
   // X hours ago
   const hoursAgo = Math.floor(timeDifference / hour);
   formattedDate = `${hoursAgo} hours ago`;
 } else if (timeDifference < day) {
   // Today
   const options = { hour: 'numeric', minute: 'numeric' };
   formattedDate = `today at ${postedDate.toLocaleTimeString('en-US', options)}`;
 } else if (timeDifference < 2 * day) {
   // Yesterday
   formattedDate = 'yesterday';
 } else {
   // In DD-MM-YY format
   formattedDate = postedDate.toLocaleDateString('en-GB', {
     day: '2-digit',
     month: '2-digit',
     year: '2-digit'
   });
   formattedDate = `on ${formattedDate}`;
 }

 return formattedDate;
 
}


export default getFormattedDate