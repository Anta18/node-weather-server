const request = require("postman-request");
const geocode = (address, callback) => {
  const geourl =
    "http://api.positionstack.com/v1/forward?access_key=e8eafbcf931329a4a91c5e7068432b6c&query=" +
    encodeURIComponent(address) +
    "&limit=1";

  request({ url: geourl, json: true }, (error, { body } = {}) => {
    if (error) {
      callback("Unable to connect to location services!", undefined);
    } else if (body.data.length === 0) {
      callback("Unable to find location!Try another search.", undefined);
    } else {
      callback(undefined, {
        latitude: body.data[0].latitude,
        longitude: body.data[0].longitude,
        location: body.data[0].label,
      });
    }
  });
};
module.exports = geocode;
