const pretty = ( s ) => {
    return (s > 9)?s:'0'+s
}

const countdown = (endTime) => { 
    var now = new Date(); 
    var endDate = new Date(endTime); 
    var leftTime=endDate.getTime()-now.getTime(); 
    var leftsecond = parseInt(leftTime/1000); 
    //var day1=parseInt(leftsecond/(24*60*60*6)); 
    var day1=Math.floor(leftsecond/(60*60*24)); 
    var hour=Math.floor((leftsecond-day1*24*60*60)/3600); 
    var minute=Math.floor((leftsecond-day1*24*60*60-hour*3600)/60); 
    var second=Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60); 
    return pretty(day1)+"天"+pretty(hour)+"小时"+pretty(minute)+"分"+pretty(second)+"秒"; 
} 

export default countdown