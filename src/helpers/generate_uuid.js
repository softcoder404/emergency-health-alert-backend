exports.generate6digit = () => {
        let timeStamp = Date.now().toString();
        const timeStampLen = timeStamp.length;
        timeStamp = timeStamp.toString().substring(timeStampLen - 6)
        return timeStamp;
}