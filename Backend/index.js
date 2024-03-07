const express= require('express')
const mongoose= require('mongoose')
const cors = require('cors')

const app=express()

app.use(cors())

app.use(express.json())

app.use(express.urlencoded(
    {
        extened:true
    }
))

mongoose.connect('mongodb://127.0.0.1:27017/crudfor4pm',{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

var db = mongoose.connection

db.once('open',()=>{
    console.log('Database started')
})


const dataschema = new mongoose.Schema({
    name:String,
    description:String
})

const datamodel = mongoose.model('details',dataschema)

app.get('/myapi',async(req,res)=>{
    try{

        const item = await datamodel.find()
        res.json(item)
        res.status(201)

    }
    catch(error){
        console.log(error)
        res.json({message:error.message})
    }
})


app.post('/myapi',async (req,res)=>{
    try{

        const {name,description}=req.body;

        const item = new datamodel({name,description})

        await item.save() 

        res.json(item)

        res.status(201)

    }catch(error){
        console.log(error)
        res.json({message:error.message})
    }
})



app.put('/myapi/:id',async(req,res)=>{
    try{
        const {name,description}=req.body;
        const {id} = req.params

        const item = await datamodel.findById(id)

        if(!item){ 
            res.status(404).json({message:'Data not found'})
        }


        item.name=name;
        item.description =description;

        await item.save()

        res.status(201).json(item)

    }catch(error){
        console.log(error)
        res.json({message:error.message})
    }
})


app.delete('/myapi/:id',async(req,res)=>{
    try{
        const {id}=req.params;

        const item = await datamodel.findById(id)

        if(!item){ 
            res.status(404).json({message:'Data not found'})
        }

            await item.deleteOne()

            res.status(201).json({message:'Data deleted'})

    }catch(error){
        console.log(error)
        res.json({message:error.message})
    }
})



app.listen(8082,()=>{
    console.log('server started')
})