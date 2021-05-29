const toMinutes = date => (date / 1000) / 60;
const toHours = date => (date / 1000) / 3600;
const toDays = date => ((date / 1000) / 3600) / 24;

// format time to dd:hh:mm:ss
const formatTime = ms => {
    let seconds = Math.floor((ms / 1000) % 60);
    let minutes = Math.floor((ms / (1000 * 60)) % 60);
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 365);

    hours = (hours < 10) ? `0${hours}` : hours;
    minutes = (minutes < 10) ? `0${minutes}` : minutes;
    seconds = (seconds < 10) ? `0${seconds}` : seconds;

    return `${days ? `**${days}**d ` : ``}**${hours}**h **${minutes}**m **${seconds}**s`;
};

// calculate time between now and end date
const subtractDate = endDate => {
    const now = new Date();
    let timeLeft = endDate.getTime() - now.getTime();

    if (timeLeft < 0) {
        timeLeft = 0;
    }

    return timeLeft;
};

export {
    toMinutes,
    toHours,
    toDays,
    formatTime,
    subtractDate
};
