var express = require('express')
var bodyParser = require('body-parser')

var app = express()
var path = require('path')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname)))

app.get('/',(req,res)=>{
 
    res.sendFile('index.html', function (err) {
        if (err) {
          next(err);
        } else {
          console.log('Sent:', "index.html");
        }
      })
})

console.log("listening to port 3000")
app.listen('3000')