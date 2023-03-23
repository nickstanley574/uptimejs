
function getSecondsDownPerYear(uptimePercentage, secondsPerYear = 0) {
    const uptime = uptimePercentage / 100;
    if (secondsPerYear == 0) {
      secondsPerYear = 365 * 24 * 60 * 60;
    }
    const secondsDownPerYear = secondsPerYear * (1 - uptime);
    return secondsDownPerYear;
}


function splitSeconds(downSeconds) {
    var hours = Math.floor(downSeconds / 3600);
    hours = (hours != 0) ? `${hours}h`: ""
    var minutes = Math.floor((downSeconds % 3600) / 60);
    minutes = (minutes != 0) ? `${minutes}m`: ""
    var seconds = downSeconds % 60;
    seconds = (seconds != 0) ? `${seconds}s`: ""
    return `${hours} ${minutes} ${seconds}`
  }


function letterToNumber(l) {
    return parseInt(l, 36) - 10
}


function numberToLetter(n) {
    return 'abcdefghijklmnopqrstuvwxyz'[n]
}


function convertSecsToDays(seconds) {
    return (seconds > 1) ? parseInt(seconds / 86400) : 0;
}


function convertSecsToHours(seconds) {
    return parseInt(seconds / 3600);
}


function convertSecsToMinutes(seconds) {
    return parseInt(seconds / 60);
}


function simplifyPercentage(value) {
    return (value % 1 === 0) ? Math.trunc(value) : value
}


function formattedElapsedTime(seconds){
    elapsedStr = ''

    let numDays = convertSecsToDays(seconds);
    elapsedStr += (numDays > 0) ? `${numDays}d ` : '';

    seconds = seconds % 86400; // Remaining second after getting the days

    let numHours = convertSecsToHours(seconds);
    elapsedStr += (numHours > 0) ? `${numHours}h ` : '';

    seconds = seconds % 3600; // Remaining second after getting the hours
    let numMinutes = convertSecsToMinutes(seconds);
    elapsedStr += (numMinutes > 0) ? `${numMinutes}m ` : '';

    let numSeconds = seconds % 60; // Remaining second after getting the minutes and also the result for the number of seconds
    if (numSeconds > 1)         { numSeconds = numSeconds.toFixed(1) }
    else if (numSeconds < 0.01) { numSeconds = numSeconds.toFixed(4) }
    else                        { numSeconds = numSeconds.toFixed(2) }

    elapsedStr += (numSeconds > 0) ? `${numSeconds}s ` : '';

    return elapsedStr
}


function uptimePercentage(downtimeSeconds, totalSeconds) {
    percentage = ((totalSeconds - downtimeSeconds) / totalSeconds * 100).toFixed(4)
    if  (percentage == 100)  { percentage = 100 }
    else if (percentage < 0) { percentage = 0 }
    percentage = (percentage == 100) ? 100: percentage;
    return simplifyPercentage(percentage)
}


function generateReverseNumbers() {

    var downtimeSeconds = 0
    var downtimeValue = document.getElementById('input-downtime-duration').value.replace(/\s+/g,' ').trim();
    
    var elements = document.getElementsByClassName("inputted-value");
    for (var i = 0; i < elements.length; i++) {
        elements[i].innerHTML = downtimeValue;
    }

    downtimeValue.split(" ").forEach(function (value, index) {
        downtimeSeconds += (value.includes('s')) ? parseInt(value) : 0;
        downtimeSeconds += (value.includes('m')) ? parseInt(value) * 60 : 0;
        downtimeSeconds += (value.includes('h')) ? parseInt(value) * 3600 : 0;
        downtimeSeconds += (value.includes('d')) ? parseInt(value) * 86400 : 0;
    });

    var wkArgument = ""
    var weeklyUptimeHours = 0

    var dailyUptimes = document.getElementsByClassName("uptime-daily");
    for (var i = 0; i < dailyUptimes.length; i++) {
        hours = parseInt(dailyUptimes[i].value)
        weeklyUptimeHours += hours
        wkArgument += numberToLetter(hours)
    }

    uptimeSecondPerYear = weeklyUptimeHours * 3600 * 52

    secondsUpPerWeek = uptimeSecondPerYear / 52
    secondsUpPerMonth = uptimeSecondPerYear / 12
    secondsUpPerQuarter = uptimeSecondPerYear / 4

    var dailyUptimePercentage = uptimePercentage(downtimeSeconds, 86400) // Total number of seconds in a daily
    document.getElementById('dailyTime').innerHTML = `${dailyUptimePercentage} %`

    var weeklyUptimePercentage = uptimePercentage(downtimeSeconds, secondsUpPerWeek)
    document.getElementById('weeklyTime').innerHTML = `${weeklyUptimePercentage} %`

    var monthlyUptimePercentage = uptimePercentage(downtimeSeconds, secondsUpPerMonth)
    document.getElementById('monthlyTime').innerHTML = `${monthlyUptimePercentage} %`
    
    var quarterlyUptimePercentage = uptimePercentage(downtimeSeconds, secondsUpPerQuarter)
    document.getElementById('quarterlyTime').innerHTML = `${quarterlyUptimePercentage} %`

    var yearlyUptimePercentage = uptimePercentage(downtimeSeconds, uptimeSecondPerYear)
    document.getElementById('yearlyTime').innerHTML = `${yearlyUptimePercentage} %`;

    linkParams = `?down=${downtimeSeconds}`
    linkParams += (wkArgument.length != 0) ? `&wk=${wkArgument}` : ''
    
    var shareLinkElement = document.getElementById('share-link');
    shareLinkElement.setAttribute('href', linkParams);
    shareLinkElement.innerText = `${window.location.host}${linkParams}`
}    


function generateDowntimeNumbers() {

    var wkArgument = ""
    var weeklyUptimeHours = 0

    var dailyUptimes = document.getElementsByClassName("uptime-daily");
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

    var slaPercentage = document.getElementById('input_sla_percentage').value;
    let secondsDownPerYear = getSecondsDownPerYear(slaPercentage, uptimeSecondPerYear)

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
        slaPercentageElements[i].innerHTML = slaPercentage;
    }

    linkParams = `?sla=${slaPercentage}`
    linkParams += (wkArgument.length != 0) ? `&wk=${wkArgument}` : ''

    var slaLinkElement = document.getElementById('share-link');
    slaLinkElement.setAttribute('href', linkParams);
    slaLinkElement.innerText = `${window.location.host}${linkParams}`
}


function main() {
    const urlParams = new URLSearchParams(window.location.search);

    const downUrlParam = urlParams.get('down')
    const slaUrlParam = urlParams.get('sla')
    const wkUrlParam = urlParams.get('wk')

    if (wkUrlParam) {
        document.getElementById("uptime-mon").value = letterToNumber(wkUrlParam[0])
        document.getElementById("uptime-tue").value = letterToNumber(wkUrlParam[1])
        document.getElementById("uptime-wed").value = letterToNumber(wkUrlParam[2])
        document.getElementById("uptime-thu").value = letterToNumber(wkUrlParam[3])
        document.getElementById("uptime-fri").value = letterToNumber(wkUrlParam[4])
        document.getElementById("uptime-sat").value = letterToNumber(wkUrlParam[5])
        document.getElementById("uptime-sun").value = letterToNumber(wkUrlParam[6])
    }

    if (slaUrlParam) {
        document.getElementById("input_sla_percentage").value = slaUrlParam
    } else {
        var inputSlaPercentage = document.getElementById("input_sla_percentage")
        if (inputSlaPercentage) {
            inputSlaPercentage.value = 99.99
        }
    }

    if (downUrlParam) {
        document.getElementById("input-downtime-duration").value = splitSeconds(downUrlParam)
    } else {
        var inputDowntimeDurationElement = document.getElementById("input-downtime-duration")
        if (inputDowntimeDurationElement) {
            inputDowntimeDurationElement.value = "12h"
        }
    }

    const button = document.getElementById("submitButton");
    if (button) {
        button.click()
    }
}

main()