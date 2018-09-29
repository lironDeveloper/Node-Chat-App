var generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: new Date().getTime()
    }
};

var generateLocationMessage = (from, latitude, longtitude) => {
    return {
        from,
        url: `https://www.google.com/maps/?q=${latitude},${longtitude}`,
        createdAt: new Date().getDate()
    };
};

module.exports = {generateMessage, generateLocationMessage};