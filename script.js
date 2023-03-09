
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


function generateDowntimeNumbers() {
    var sla_percentage = document.getElementById('input_sla_percentage').value;

    weeklyUptimeHours = 0
    var dailyUptimes = document.getElementsByClassName("uptime-daily");

    if (dailyUptimes.length == 0) {
        weeklyUptimeHours = 168
    } else {
        for (var i = 0; i < dailyUptimes.length; i++) {
            weeklyUptimeHours += parseInt(dailyUptimes[i].value)
        }
    }

    uptimeSecondPerYear = weeklyUptimeHours * 3600 * 52

    let secondsDownPerYear = getSecondsDownPerYear(sla_percentage, uptimeSecondPerYear)

    secondsDownPerDay = secondsDownPerYear / 365.2425
    secondsDownPerWeek = secondsDownPerYear / 52
    secondsDownPerMonth = secondsDownPerYear / 12
    secondsDownPerQuarter = secondsDownPerYear / 4

    document.getElementById('dailyTime').innerHTML = formattedElapsedTime(secondsDownPerDay);
    document.getElementById('weeklyTime').innerHTML = formattedElapsedTime(secondsDownPerWeek);
    document.getElementById('monthlyTime').innerHTML = formattedElapsedTime(secondsDownPerMonth);
    document.getElementById('quarterlyTime').innerHTML = formattedElapsedTime(secondsDownPerQuarter);
    document.getElementById('yearlyTime').innerHTML = formattedElapsedTime(secondsDownPerYear);
    
    var sla_percentage_locations = document.getElementsByClassName("sla_percentage");
    for (var i = 0; i < sla_percentage_locations.length; i++) {
        sla_percentage_locations[i].innerHTML = sla_percentage;
    }

    var yourElement = document.getElementById('sla_link');
    yourElement.setAttribute('href', `?sla=${sla_percentage}`);
}

const inputField = document.getElementById("input_sla_percentage");
const button = document.getElementById("submitButton");

const urlParams = new URLSearchParams(window.location.search);
const sla = urlParams.get('sla')

document.getElementById("current_host").textContent = window.location.href.replace(/(^\w+:|^)\/\//, '');

if (sla != null) {
    document.getElementById("input_sla_percentage").value = sla
    button.click()
} else {
    document.getElementById("input_sla_percentage").value = 99.99
    button.click()
}

inputField.addEventListener("keyup", function(event) {
    // Check if "Enter" key was pressed
    if (event.keyCode === 13) {
      button.click();
    }
  });