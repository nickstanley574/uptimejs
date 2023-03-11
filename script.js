
function getSecondsDownPerYear(uptimePercentage, secondsPerYear = 0) {
    const uptime = uptimePercentage / 100;
    if (secondsPerYear == 0) {
      secondsPerYear = 365 * 24 * 60 * 60;
    }
    const secondsDownPerYear = secondsPerYear * (1 - uptime);
    return secondsDownPerYear;
}

function letterToNumber(l) {
    // a  b  c  d  e  f  g  h  i  j  k  l  m  n  o  p  q  r  s  t  u  v  w  x  y  z
    // 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25  
    return parseInt(l, 36) - 10
}

function numberToLetter(n) {
    return 'abcdefghijklmnopqrstuvwxyz'[n]
}

function convertSecsToDays(seconds) {
    let days = (seconds > 1) ? parseInt(seconds / 86400) : 0;
    return days;
}

function convertSecsToHours(seconds) {
    let hours = parseInt(seconds / 3600);
    return hours;
}

function convertSecsToMinutes(seconds) {
    let minutes = parseInt(seconds / 60);
    return minutes;
}

function formattedElapsedTime(seconds){
    elapsedStr = ''

    let numOfDays = convertSecsToDays(seconds);
    elapsedStr += (numOfDays > 0) ? `${numOfDays}d ` : '';

    seconds = seconds % 86400; // Remaining second after getting the days

    let numOfHours = convertSecsToHours(seconds);
    elapsedStr += (numOfHours > 0) ? `${numOfHours}h ` : '';

    seconds = seconds % 3600; // Remaining second after getting the hours
    let numOfMinutes = convertSecsToMinutes(seconds);
    elapsedStr += (numOfMinutes > 0) ? `${numOfMinutes}m ` : '';

    let numOfSeconds = seconds % 60; // Remaining second after getting the minutes and also the result for the number of seconds
    if (numOfSeconds > 1) {
        numOfSeconds = numOfSeconds.toFixed(1)
    } else if (numOfSeconds < 0.01) {
        numOfSeconds = numOfSeconds.toFixed(4)
    } else {
        numOfSeconds = numOfSeconds.toFixed(2) 
    }

    elapsedStr += (numOfSeconds > 0) ? `${numOfSeconds}s ` : '';

    return elapsedStr
}


function uptimePercentage(downtimeSeconds, totalSeconds) {
    return ((totalSeconds - downtimeSeconds) / totalSeconds * 100).toFixed(3)
}

function generateReverseNumbers() {

    var downtimeSeconds = 0

    var downtimeValue = document.getElementById('input-downtime-duration').value;
    downtimeValue = downtimeValue.replace(/\s+/g,' ').trim().split(" ");
    
    downtimeValue.forEach(function (value, index) {
        downtimeSeconds += (value.includes('s')) ? parseInt(value) : 0;
        downtimeSeconds += (value.includes('m')) ? parseInt(value) * 60 : 0;
        downtimeSeconds += (value.includes('h')) ? parseInt(value) * 3600 : 0;
        downtimeSeconds += (value.includes('d')) ? parseInt(value) * 86400 : 0;
      });


    const totalDaySeconds = 86400 // Total number of seconds in a daily
    var dailyUptimePercentage = uptimePercentage(downtimeSeconds, totalDaySeconds)
    document.getElementById('dailyTime').innerHTML = `${dailyUptimePercentage} %`

    const totalWeeklySeconds = 604800 // Total number of seconds in a weekly
    var weeklyUptimePercentage = uptimePercentage(downtimeSeconds, totalWeeklySeconds)
    document.getElementById('weeklyTime').innerHTML = `${weeklyUptimePercentage} %`

    const totalMonthlySeconds = 2678400 // Total number of seconds in most months
    var monthlyUptimePercentage = uptimePercentage(downtimeSeconds, totalMonthlySeconds)
    document.getElementById('monthlyTime').innerHTML = `${monthlyUptimePercentage} %`
    
    const totalQuarterlySeconds = 7884000 // Total number of seconds in quarter
    var quarterlyUptimePercentage = uptimePercentage(downtimeSeconds, totalQuarterlySeconds)
    document.getElementById('quarterlyTime').innerHTML = `${quarterlyUptimePercentage} %`

    const totalYearSeconds = 31536000; // Total number of seconds in a yearly
    var yearlyUptimePercentage = uptimePercentage(downtimeSeconds, totalYearSeconds)
    document.getElementById('yearlyTime').innerHTML = `${yearlyUptimePercentage} %`;

}    



function generateDowntimeNumbers() {
    var sla_percentage = document.getElementById('input_sla_percentage').value;

    weeklyUptimeHours = 0
    var dailyUptimes = document.getElementsByClassName("uptime-daily");

    wkArgument = ""

    if (dailyUptimes.length == 0) {
        weeklyUptimeHours = 168
    } else {
        for (var i = 0; i < dailyUptimes.length; i++) {
            hours = parseInt(dailyUptimes[i].value)
            weeklyUptimeHours += hours
            wkArgument += numberToLetter(hours)
        }
    }

    uptimeSecondPerYear = weeklyUptimeHours * 3600 * 52

    let secondsDownPerYear = getSecondsDownPerYear(sla_percentage, uptimeSecondPerYear)

    secondsDownPerDay = secondsDownPerYear / 365.2425
    secondsDownPerWeek = secondsDownPerYear / 52
    secondsDownPerMonth = secondsDownPerYear / 12
    secondsDownPerQuarter = secondsDownPerYear / 4

    // Only Display daily for simple SLA page
    dailyTimeElement = document.getElementById('dailyTime')
    if (dailyTimeElement) {
        dailyTimeElement.innerHTML = formattedElapsedTime(secondsDownPerDay);
    }

    document.getElementById('weeklyTime').innerHTML = formattedElapsedTime(secondsDownPerWeek);
    document.getElementById('monthlyTime').innerHTML = formattedElapsedTime(secondsDownPerMonth);
    document.getElementById('quarterlyTime').innerHTML = formattedElapsedTime(secondsDownPerQuarter);
    document.getElementById('yearlyTime').innerHTML = formattedElapsedTime(secondsDownPerYear);
    
    var slaPercentageElements = document.getElementsByClassName("sla_percentage");
    for (var i = 0; i < slaPercentageElements.length; i++) {
        slaPercentageElements[i].innerHTML = sla_percentage;
    }

    host = window.location.href.split('?')[0].replace(/(^\w+:|^)\/\//, '');
    
    linkParams = `?sla=${sla_percentage}`
    linkParams += (wkArgument.length != 0) ? `&wk=${wkArgument}` : ''

    var slaLinkElement = document.getElementById('sla_link');
    slaLinkElement.setAttribute('href', linkParams);
    slaLinkElement.innerText = `${host}${linkParams}`
}

const button = document.getElementById("submitButton");

const urlParams = new URLSearchParams(window.location.search);
const sla = urlParams.get('sla')

wk = urlParams.get('wk')

if (wk != null) {

    // document.getElementById('wk').innerHTML = "qwertyu"

    document.getElementById("uptime-mon").value = letterToNumber(wk[0])
    document.getElementById("uptime-tue").value = letterToNumber(wk[1])
    document.getElementById("uptime-wed").value = letterToNumber(wk[2])
    document.getElementById("uptime-thu").value = letterToNumber(wk[3])
    document.getElementById("uptime-fri").value = letterToNumber(wk[4])
    document.getElementById("uptime-sat").value = letterToNumber(wk[5])
    document.getElementById("uptime-sun").value = letterToNumber(wk[6])
}

if (sla != null) {
    document.getElementById("input_sla_percentage").value = sla
    button.click()
} else {
    input_sla_percentage = document.getElementById("input_sla_percentage")
    if (input_sla_percentage) {
        input_sla_percentage.value = 99.99
    }
    button.click()
}

// const inputField = document.getElementById("input_sla_percentage");
// inputField.addEventListener("keyup", function(event) {
//     // Check if "Enter" key was pressed
//     if (event.keyCode === 13) {
//       button.click();
//     }
//   });