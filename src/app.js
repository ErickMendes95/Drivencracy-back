import express from "express";
import cors from "cors"
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import dayjs from "dayjs";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try {
    await mongoClient.connect();
    db = mongoClient.db();
    console.log("MongoDB Connected")
} catch (err){
    console.log(err)
}

const dayjsFormat = ('YYYY/MM/DD HH:mm');

const app = express();
app.use(express.json()).use(cors());

app.get("/poll",async (req,res) => {
    try {
        const poll = await db.collection("poll").find({}).toArray();
        res.status(200).send(poll);
    } catch (error) {
        console.log(error.message);
    }
})

app.get("/poll/:id/choice",async (req,res) => {
    try {
        
    } catch (error) {
        console.log(error.message)
    }
})

app.get("/poll/:id/result",async (req,res) => {
    try {
        
    } catch (error) {
        console.log(error.message)
    }
})

app.post("/poll",async (req,res) => {
    try {
        const {title, expireAt} = req.body;
        let newDate = expireAt;
        if(!title){
            return res.status(422).send("Title não pode ser vazio");
        }

        if(!newDate){
            newDate = dayjs().add(30, 'day').format(dayjsFormat);
        }

        await db.collection("poll").insertOne({
            title: title,
            expireAt: newDate
        })

        res.status(201).send("Enquete criada com sucesso")
    } catch (error) {
        console.log(error.message)
    }
})

app.post("/choice",async (req,res) => {
    try {
        const {title, pollId} = req.body

        const specificPoll = await db.collection("poll").findOne({_id: ObjectId(pollId)}).toArray();

        if(!specificPoll){
            return res.status(404).send("A enquete não existe");
        }
        
        if(!title){
            return res.status(422).send("Title não pode ser vazio");
        }

        const arrayChoices = await db.collection("choices").findOne({title: title, pollId: pollId})
        // const titleExist = specificPoll.pollChoices.filter((e) => {
        //   if(e.title === title){
        //     return true
        //   }
        // })

        // Ou tem a opção de criar um objeto estático na poll de uma vez em vez do padrão

        if(arrayChoices){
            return res.status(409).send("O title não pode ser repetido")
        }

        if(specificPoll.expireAt < dayjs().format(dayjsFormat)){
            return res.status(403).send("A enquete já expirou")
        }

        await db.collection("choices").insertOne({title, pollId})
        await db.collection("poll").aggregate([
            {
                $lookup:{
                    from:"choices",
                    as:"pollChoices"
                }
            }
        ])
        return send.status(201).send("Opção de voto criada")
        
    } catch (error) {
        console.log(error.message);
    }
})

app.post("/choice/:id/vote",async (req,res) => {
    try {
        
    } catch (error) {
        console.log(error.message)
    }
})





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server rodando na porta " + PORT));