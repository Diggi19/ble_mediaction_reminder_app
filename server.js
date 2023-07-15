require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

// configure server
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

// configure mongodb database
mongoose.connect(process.env.DATABASE_STREAM)
    .then((result) => {
        app.listen(5000,()=>{
            console.log("running on port 5000")
        })
    }).catch((err) => {
        console.log(err)
    });
const database = mongoose.connection

database.on("error",(err)=>{
    console.log(err)
})
database.once("connected",()=>{
    console.log("Database connected")
})

// defining schema 
const reminderSchema = new mongoose.Schema(
    {
        reminderMsg:String,
        remindAt:String,
        isReminded:Boolean,
        time:String
    }
)

// connecting database model
const reminderModel = new mongoose.model("reminderTask",reminderSchema)


// creating routes
app.get('/allReminders',async(req,res)=>{
    try {
        const data = await reminderModel.find()
        res.status(200).json(data)
    } catch (err) {
        console.log("error while fetching data",err)
    }
})
app.post('/addReminder',async(req,res)=>{
    const newData = new reminderModel({
        reminderMsg:req.body.reminderMsg,
        remindAt:req.body.remindAt,
        time:req.body.time,
        isReminded:false           
    })
    try {
        const savedData = await newData.save()
        res.send("data saved successfully")
    } catch (err) {
        console.log("error while creating new entry",err)
    }
})
app.delete('/deleteReminder/:id',async(req,res)=>{
    try {
        const id = req.params.id
        const deleteData = await reminderModel.findByIdAndDelete(id)
        const updatedData = await reminderModel.find()
        res.json(updatedData)
    } catch (err) {
        console.log("error while deleting",err)
    }
})

app.put('/updateReminder/:id',async(req,res)=>{
    // update isreminded to true
    try {
        const id = req.params.id
        const updateData = {isReminded:true}
        const options = {new:true}
        const result = await reminderModel.findByIdAndDelete(
            id
        )
        const updatedData = await reminderModel.find()
        res.json(updatedData)
    } catch (err) {
        console.log(err)
    }

})

// running the server
