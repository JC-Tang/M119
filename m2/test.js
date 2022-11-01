// based on the example on https://www.npmjs.com/package/@abandonware/noble

const noble = require('@abandonware/noble');

const uuid_service = "1101"
const uuid_value = ["2101", "2102", "2103"]

noble.on('stateChange', async (state) => {
  if (state === 'poweredOn') {
    console.log("start scanning")
    await noble.startScanningAsync([uuid_service], false);
  }
});


noble.on('discover', async (peripheral) => {
  await noble.stopScanningAsync();
  await peripheral.connectAsync();
  const {characteristics} = await peripheral.discoverSomeServicesAndCharacteristicsAsync([uuid_service], uuid_value);
  readxData(characteristics[0]);
  readyData(characteristics[1]);
  readzData(characteristics[2]);
});

//
// read data periodically
//
let readxData = async (characteristic) => {
  const value = (await characteristic.readAsync());
  console.log("x: " + value.readFloatLE(0));

  // read data again in t milliseconds
  setTimeout(() => {
    readxData(characteristic)
  }, 10);
}

let readyData = async (characteristic) => {
  const value = (await characteristic.readAsync());
  console.log("y: " + value.readFloatLE(0));

  // read data again in t milliseconds
  setTimeout(() => {
    readyData(characteristic)
  }, 10);
}

let readzData = async (characteristic) => {
  const value = (await characteristic.readAsync());
  console.log("z: " + value.readFloatLE(0));

  // read data again in t milliseconds
  setTimeout(() => {
    readzData(characteristic)
  }, 10);
}
