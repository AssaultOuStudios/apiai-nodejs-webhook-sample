const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const nodemailer = require('nodemailer')
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

  if (action === 'get_location') {
    let name = req.body.result.parameters.first_name;
    let surname = req.body.result.parameters.surname;
    let api = `http://52.179.15.57:8080/location/${name}/${surname}`
    request(api, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          let message = JSON.parse(body).length !== 0 ? `${name} ${surname} sits in ${JSON.parse(body)[0].location}` : 'This user was not found';
          res.send({
            speech: message,
            displayText: message,
            source: 'location-webhook',
            data: {
              facebook: {
                text: message
              }
            }
          });
      }
    })
  }

  if (action === 'complaint_entry') {
    let name = req.body.result.parameters.first_name;
    let surname = req.body.result.parameters.surname;
    let email = req.body.result.parameters.email_address;
    let phone = req.body.result.parameters.phone_number;
    let complaint = req.body.result.parameters.complaint_detail;

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'vernon.hiriji.joyce@gmail.com',
        pass: '0827841899'
      }
    });

    var mailOptions = {
      from: 'complaints@rmbbot.com',
      to: 'vernon@assaultou.com',
      subject: `${name} ${surname} has a complaint about RMB`,
      text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

})

app.listen(app.get('port'), function () {
  console.log('* Webhook service is listening on port:' + app.get('port'))
})
