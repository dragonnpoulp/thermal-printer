const Interface = require("./interface");

class WebUSB extends Interface {
  constructor(_type, usb) {
    super();
    if (usb) {
      this.productId = usb.productId;
      this.vendorId = usb.vendorId;
    }
  }

  static isWebUSBAvailable() {
    const usb = navigator?.usb;
    return usb && usb.getDevices && usb.requestDevice;
  }

  static validateBrowser() {
    if (!this.isWebUSBAvailable()) {
      throw new Error("NO_WEBUSB");
    }
  }

  static requestPrinter() {
    WebUSB.validateBrowser();
    return navigator.usb.requestDevice({ filters: [] });
  }

  async getDevice() {
    const devices = await navigator.usb.getDevices();

    return devices.find(
      (usb) =>
        usb.productId === this.productId && usb.vendorId === this.vendorId
    );
  }

  async getPrinterName() {
    const device = await this.getDevice();
    return device.productName;
  }

  async isPrinterConnected() {
    return !!(await this.getDevice());
  }

  async execute(buffer) {
    const device = await this.getDevice();
    await device.open();
    await device.selectConfiguration(1);
    await device.claimInterface(0);
    await device.transferOut(1, buffer);
    await device.close();
  }
}

module.exports = WebUSB;
