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

  if (action === 'manages') {
    let name = req.body.result.parameters.first_name;
    let surname = req.body.result.parameters.surname;
    let api = `http://52.179.15.57:8080/manages/employee/${name}/${surname}`
    request(api, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          let manager = JSON.parse(body)[0];
          let message = JSON.parse(body).length !== 0 ? `${name} ${surname} reports to ${manager.firstname}  ${manager.surname}` : 'This user was not found';
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

  if (action === 'employee_number') {
    let name = req.body.result.parameters.first_name;
    let surname = req.body.result.parameters.surname;
    let api = `http://52.179.15.57:8080/get/employee/${name}/${surname}`
    request(api, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          let message = JSON.parse(body).length !== 0 ? `Your employee number is ${JSON.parse(body)[0].employeeId}` : 'This user was not found';
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

  if (action === 'contact_details') {
    let name = req.body.result.parameters.first_name;
    let surname = req.body.result.parameters.surname;
    let api = `http://52.179.15.57:8080/get/employee/${name}/${surname}`
    request(api, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          let message = JSON.parse(body).length !== 0 ? `Your employee number is ${JSON.parse(body)[0].employeeId}` : 'This user was not found';
          res.send({
            speech: message,
            displayText: message,
            source: 'location-webhook',
            "messages": [
              {
                "type": 0,
                "id": "52b8994c-dfe0-4e97-a346-db834c304261",
                "speech": "Your employee number is 4991982"
              },
              {
                "type": 4,
                "id": "fb8ccd44-ed27-4d3a-9ba5-c68bf7ea25c1",
                "payload": {
                  "cards": [
                    {
                      "Title": "Dave Sinclair",
                      "Link": "mailto:dave.sinclair@rmb.co.za",
                      "Description": "Phone: <a href= \"tel:+27 11 282 8077\">+27 11 282 8077</a><br> Email: <a href= \"mailto:dave.sinclair@rmb.co.za\">dave.sinclair@rmb.co.za</a>",
                      "Type": "contact",
                      "Status": "",
                      "Author": "",
                      "ModifiedDate": "",
                      "ExpiryDate": "",
                      "StackOrder": "",
                      "Featured": "",
                      "CardTemplate": "priority-vertical",
                      "CardFocalPoint": "top-left",
                      "CardImage": "dave-sinclair",
                      "Icon": "",
                      "CardClasses": "",
                      "ColumnWidth": "2"
                    }
                  ]
                }
            ],
            data: {
              facebook: {
                text: message
              }
            }
          });
      }
    })
  }

  if (action === 'business_unit_total') {
    let business_unit = req.body.result.parameters.business_unit;
    let api = `http://52.179.15.57:8080/division/employee/count/${business_unit}`
    request(api, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          let message = JSON.parse(body).length !== 0 ? `There are ${body} employees in ${business_unit}` : `Couldn't find ${business_unit}`;
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

})

app.listen(app.get('port'), function () {
  console.log('* Webhook service is listening on port:' + app.get('port'))
})
