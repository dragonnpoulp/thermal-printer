function getInterface(uri, options, _driver) {
  const WebUSB = require("./webusb");
  return new WebUSB(uri, options);
}

module.exports = getInterface;
