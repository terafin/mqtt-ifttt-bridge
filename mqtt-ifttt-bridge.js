// Requirements
const mqtt = require('mqtt')
const url = require('url')
const express = require('express')
const bodyParser = require('body-parser');
const logging = require('homeautomation-js-lib/logging.js')
const _ = require('lodash')

require('homeautomation-js-lib/mqtt_helpers.js')


// Setup MQTT
var client = mqtt.setupClient(null, null)

// Web front end
var app = express()
app.use(bodyParser.json());

app.post('/ifttt/post', function(req, res) {
    const body = req.body
    if (_.isNil(body) || _.isNil(body.topic)) {
        res.send('Body has empty topic: ' + JSON.stringify(body))
        return
    }

    if (_.isNil(body) || _.isNil(body.value)) {
        res.send('Body has empty value: ' + JSON.stringify(body))
        return
    }

    var topic = body.topic
    var value = body.value

    logging.log('Publishing: ' + topic + ':' + value)
    client.publish(topic.toString(), value.toString())
    res.send('topic: ' + topic + ' value: ' + value)
})

app.get('/ifttt/*', function(req, res) {
    var url_info = url.parse(req.url, true)

    if (_.isNil(req.url) || _.isNil(url_info)) {
        res.send('Empty URL')
        return
    }

    var topic = url_info.pathname.slice(6)
    var value = url_info.query.value

    logging.log('Publishing: ' + topic + ':' + value)
    client.publish(topic, value)
    res.send('topic: ' + topic + ' value: ' + value)
})

app.listen(3000, function() {
    logging.log('IFTTT listener started on port 3000')
})