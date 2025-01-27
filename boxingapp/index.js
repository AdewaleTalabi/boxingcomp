var express=require("express")
var bodyParser=require("body-parser")
var mongoose=require("mongoose")
require("dotenv").config()

const app=express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
mongoose.connect(process.env.MONGODB_CONNECTION_URI)
var db=mongoose.connection
db.on('error',()=> console.log("Error in Connecting to Database"))
db.once('open',()=> console.log("Connected to Database"))

app.post("/register",(req,res) => {
    var first_name = req.body.first_name
    var last_name = req.body.last_name
    var email = req.body.email
    var dob = req.body.dob
    var division = req.body.division

    var data={
        "first_name":first_name,
        "last_name": last_name,
        "email":email,
        "dob":dob,
        "division":division
    }
    db.collection('boxers').insertOne(data,(err,collection) => {
        if(err){
            throw err;
        }
        console.log("Record Inserted Succesfully")
    })
    return res.redirect('registration_successful.html')
})


app.get("/",(req,res) =>{
    res.set({
        "Allow-access-Allow-Origin":"*"
    })
    return res.redirect('index.html')
}).listen(3000)

console.log("Listening on port 3000")