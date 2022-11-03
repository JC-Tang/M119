// based on the example on https://www.npmjs.com/package/@abandonware/noble

const noble = require('@abandonware/noble');

const uuid_service = "1101"
const uuid_value = ["2101","2102","2103"]
// const uuid_value = "2101"

let sensorValue_x = NaN
let sensorValue_y = NaN
let sensorValue_z = NaN

noble.on('stateChange', async (state) => {
    if (state === 'poweredOn') {
        console.log("start scanning")
        await noble.startScanningAsync([uuid_service], false);
    }
});

noble.on('discover', async (peripheral) => {
    await noble.stopScanningAsync();
    await peripheral.connectAsync();
    const {
        characteristics
    } = await peripheral.discoverSomeServicesAndCharacteristicsAsync([uuid_service], uuid_value);
    readXData(characteristics[0]);
    readYData(characteristics[1]);
    readZData(characteristics[2]);
});

//
// read data periodically
//
let readXData = async (characteristic) => {
    const value = (await characteristic.readAsync());
    sensorValue_x = value.readFloatLE(0);
    console.log("X: " + sensorValue_x);

    // read data again in t milliseconds
    setTimeout(() => {
        readXData(characteristic)
    }, 10);
}

let readYData = async (characteristic) => {
    const value = (await characteristic.readAsync());
    sensorValue_y = value.readFloatLE(0);
    console.log("Y: " + sensorValue_y);

    // read data again in t milliseconds
    setTimeout(() => {
        readYData(characteristic)
    }, 10);
}

let readZData = async (characteristic) => {
    const value = (await characteristic.readAsync());
    sensorValue_z = value.readFloatLE(0);
    console.log("Z: " + sensorValue_z);

    // read data again in t milliseconds
    setTimeout(() => {
        readZData(characteristic)
    }, 10);
}

//
// hosting a web-based front-end and respond requests with sensor data
// based on example code on https://expressjs.com/
//
const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({
        sensorValue_x: sensorValue_x,
        sensorValue_y: sensorValue_y
    }))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
