// Requirements
mqtt = require('mqtt')
url = require('url')
express = require('express')
logging = require('./homeautomation-js-lib/logging.js')
mqtt_helpers = require('./homeautomation-js-lib/mqtt_helpers.js')


// Config
host = process.env.MQTT_HOST

// Set up modules
logging.set_enabled(true)

// Setup MQTT
client = mqtt.connect(host)

// MQTT Observation

client.on('connect', () => {
    logging.log('Reconnecting...\n')
    client.subscribe("#")
})

client.on('disconnect', () => {
    logging.log('Reconnecting...\n')
    client.connect(host)
})

client.on('message', (topic, message) => {
    logging.log(" " + topic + ":" + message)
})

// Web front end
app = express()

app.get('/ifttt/*', function(req, res) {
    url_info = url.parse(req.url, true)
    topic = url_info.pathname.slice(6)
    value = url_info.query.value

    logging.log("Publishing: " + topic + ":" + value)
    mqtt_helpers.publish(client, topic, value)
    res.send('topic: ' + topic + " value: " + value)
})

app.listen(3000, function() {
    console.log('IFTTT listener started on port 3000')
})