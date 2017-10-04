const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))

const REQUIRE_AUTH = true
const AUTH_TOKEN = '16a0d80c05d7403eb97811641f77723b'

app.get('/', function (req, res) {
  res.send('Use the /webhook endpoint.')
})

app.post('/webhook', function (req, res, next) {
  //var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.echoText ? req.body.result.parameters.echoText : "Seems like some problem. Speak again."
  let action = req.body.result.action;
    let name = req.body.result.parameters.first_name;
    let surname = req.body.result.parameters.surname;
    let api = `http://52.179.15.57:8080/location/${name}/${surname}`
    request(api, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          let message = body.length !== 0 ? `${name} ${surname} sits in ${JSON.parse(body)[0].location}` : 'This user was not found'
          res.send({
            speech: message,
            displayText: message,
            source: 'location-webhook',
            data: {
              facebook: {
                text: `${name} ${surname} sits in ${JSON.parse(body)[0].location}`
              }
            }
          });
      }
    })
})

app.listen(app.get('port'), function () {
  console.log('* Webhook service is listening on port:' + app.get('port'))
})


// const express = require('express')
// const bodyParser = require('body-parser')
// const app = express()
// app.use(bodyParser.json())
// app.set('port', (process.env.PORT || 5000))
//
// const REQUIRE_AUTH = true
// const AUTH_TOKEN = '16a0d80c05d7403eb97811641f77723b'
//
// app.get('/', function (req, res) {
//   res.send('Use the /webhook endpoint.')
// })
// app.get('/webhook', function (req, res) {
//   res.send('You must POST your request')
// })
//
// app.post('/webhook', function (req, res) {
//   //var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.echoText ? req.body.result.parameters.echoText : "Seems like some problem. Speak again."
//     return res.json({
//         speech: req.body.result.parameters["given-name"] + req.body.result.parameters.employee_surname + " sits in 2nd Floor 2 Merchant Place",
//         displayText: req.body.result.parameters["given-name"] + req.body.result.parameters.employee_surname + " sits in 2nd Floor 2 Merchant Place",
//         source: 'webhook-echo-sample'
//     });
// })
//
// app.listen(app.get('port'), function () {
//   console.log('* Webhook service is listening on port:' + app.get('port'))
// })
