// Requirements
const mqtt = require('mqtt')
const url = require('url')
const express = require('express')
const logging = require('./homeautomation-js-lib/logging.js')
require('./homeautomation-js-lib/mqtt_helpers.js')


// Setup MQTT
var client = mqtt.setupClient(null, null)

// Web front end
var app = express()

app.get('/ifttt/*', function(req, res) {
    var url_info = url.parse(req.url, true)
    var topic = url_info.pathname.slice(6)
    var value = url_info.query.value

    logging.log('Publishing: ' + topic + ':' + value)
    client.smartPublish(topic, value)
    res.send('topic: ' + topic + ' value: ' + value)
})

app.listen(3000, function() {
    logging.log('IFTTT listener started on port 3000')
})