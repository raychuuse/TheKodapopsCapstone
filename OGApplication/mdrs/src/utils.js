function calculateDifference(a, b) {
    const diff = a.getTime() - b.getTime();
    const hours = Math.floor(diff / 1000 / 100 / 60);
    const days = Math.floor(hours / 24);
    if (days >= 1) {
        return days + ' day' + (days !== 1 ? 's' : '');
    } else {
        return hours + ' hour' + (hours !== 1 ? 's' : '');
    }
}

function standardiseData(data) {
    return data.map(obj => {
        return {
            id: obj.harvesterID || obj.sidingID || obj.locoID || obj.id,
            name: obj.harvesterName || obj.sidingName || obj.locoName || obj.name
        };
    })
}

module.exports = {
    calculateDifference,
    standardiseData
}