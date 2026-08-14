// calculate distance between two points

const calculateDistance = (latitude1,longitude1,latitude2,longitude2) => {
    const earthRadius = 6371;

    const lat1 = latitude1 * Math.PI / 180;
    const lat2 = latitude2 * Math.PI / 180;

    const deltaLatitude =
        (latitude2 - latitude1) * Math.PI / 180;

    const deltaLongitude =
        (longitude2 - longitude1) * Math.PI / 180;

    const a =
        Math.sin(deltaLatitude / 2) *
        Math.sin(deltaLatitude / 2) +
        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLongitude / 2) *
        Math.sin(deltaLongitude / 2);

    const c =
        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    const distance = earthRadius * c;

    return distance;
};

module.exports = {
    calculateDistance
};



