
const express = require ("express");
const app = express();
const bodyParser = require ('body-parser');
const request = require('request');
const https = require("https");
require('dotenv').config();

console.log(process.env.MAILCHIMP_SERVER);
console.log(process.env.MAILCHIMP_LIST_ID);





app.use (express.static("public"));
app.use (bodyParser.urlencoded({extended : true}));

app.get("/" , function(req , res){
res.sendFile(__dirname + "/signup.html");

})

app.post("/" , function (req , res) {

    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    const data = {
        members : [
            {
            email_address: email ,
            status: "subscribed",
            merge_fields : {
                FNAME : firstName,
                LNAME: lastName,
            }
            }

        ]
    };


    const jsonData = JSON.stringify(data);

    const url = `https://${process.env.MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}`;
    const options = {
        method : "POST",
        auth : `anystring:${process.env.MAILCHIMP_API_KEY}`

    }

    const request= https.request(url , options, function (response) {

        if(response.statusCode===200){
            res.sendFile (__dirname + "/success.html");
        } else {
               res.sendFile(__dirname + "/failure.html"); 
            } 
        

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })

       

         
    });




    request.write(jsonData);
          request.end();

})



app.post ("/failure" , function(req , res){
    res.redirect("/");
})

app.listen(3000  , function(){
    console.log("server is running on port 3000")
})




