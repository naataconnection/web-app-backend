const currDate = new Date();

function dateDayTime(){
    var isoDateTime = new Date(currDate.getTime() - (currDate.getTimezoneOffset() * 60000)).toISOString(); // current date and time
    var day = currDate.toLocaleString(undefined, {weekday: 'long'});
    const date = isoDateTime.substr(0, 10);
    const time = isoDateTime.substr(11, 5);
    return [date, time, day];
}

module.exports = {
    dateDayTime,
}
