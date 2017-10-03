const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))

const REQUIRE_AUTH = true
const AUTH_TOKEN = '16a0d80c05d7403eb97811641f77723b'

app.get('/', function (req, res) {
  res.send('Use the /webhook endpoint.')
})
app.get('/webhook', function (req, res) {
  res.send('You must POST your request')
})

app.post('/webhook', function (req, res) {
  var fullName = req.body.result.parameters["given-name"] + req.body.result.parameters.employee_surname;
    return res.json({
        speech: fullname + " sits in 2nd Floor 2 Merchant Place",
        displayText: speech,
        source: 'webhook-echo-sample'
    });
})

app.listen(app.get('port'), function () {
  console.log('* Webhook service is listening on port:' + app.get('port'))
})
