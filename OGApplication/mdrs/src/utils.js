function calculateDifference(a, b) {
    const diff = a.getTime() - b.getTime();
    const hours = Math.floor(diff / 1000 / 100 / 60);
    const days = Math.floor(hours / 24);
    if (days === 11915) {
        return 'Just created';
    }
    if (days >= 1) {
        return days + ' day' + (days !== 1 ? 's' : '');
    } else {
        return hours + ' hour' + (hours !== 1 ? 's' : '');
    }
}

function standardiseData(data) {
    return data.map(obj => {
        return {
            id: obj.binID || obj.harvesterID || obj.sidingID || obj.locoID || obj.id,
            name: obj.code || obj.harvesterName || obj.sidingName || obj.locoName || obj.name
        };
    })
}

function clearState() {
    window.history.replaceState({}, '');
}

function resetSuccessAlert(setSuccessFunction) {
    setTimeout(() => {
        setSuccessFunction(null);
    }, 2500);
}

module.exports = {
    calculateDifference,
    standardiseData,
    clearState,
    resetSuccessAlert
}