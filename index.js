const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const mongodb = require('mongodb')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const dbUrl = 'mongodb+srv://rohitpujari:rohitkaranpujari@cluster0.inae9ih.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(dbUrl)
const port = 3000

// getting all user information
app.get('/', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        const db = await client.db('Pujari_JCB_Spares')
        let allUsers = await db.collection('User Registration').find().toArray()
        res.status(200).send(allUsers)
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// creating new user
app.post('/userSignUp', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        if (req.body.name && req.body.email && req.body.username && req.body.password) {
            const db = await client.db('Pujari_JCB_Spares')
            let user = await db.collection('User Registration').findOne({ email: req.body.email })
            if (!user) {
                let username = await db.collection('User Registration').findOne({ username: req.body.username })
                if (!username) {
                    await db.collection('User Registration').insertOne(req.body)
                    res.status(201).send({ message: 'User Registartion Successful', data: req.body })
                }
                else {
                    res.status(400).send({ message: `User with username ${req.body.username} already exist` })
                }
            }
            else {
                res.status(400).send({ message: `User with ${req.body.email} already exist` })
            }
        }
        else {
            res.status(400).send({ message: 'name, email, username, password are mandatory' })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// editing user information
app.put('/updateUser/:email', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        if (req.params.email) {
            const db = await client.db('Pujari_JCB_Spares')
            let user = await db.collection('User Registration').findOne({ email: req.params.email })
            if (user) {
                if (req.body.mobile && req.body.address && req.body.occupation) {
                    let user = await db.collection('User Registration').updateOne({ email: req.params.email }, { $set: req.body })
                    res.status(200).send({ message: 'User info updated successfully' })
                }
                else {
                    res.status().send({ message: 'mobile, address and occupation are mandatory' })
                }
            }
            else {
                res.status(400).send({ message: `User not found with email ${req.params.email}` })
            }
        }
        else {
            res.status(400).send({ message: 'email is mandatory' })
        }
    }
    catch (error) {
        res.status(400).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// user login
app.get('/userLogin/:username/:password', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        if (req.params.username && req.params.password) {
            const db = await client.db('Pujari_JCB_Spares')
            let user = await db.collection('User Registration').findOne({ username: req.params.username, password: req.params.password })
            if (user) {
                res.status(200).send({ message: 'Login Successful', data: user })
            }
            else {
                res.status(400).send({ message: `User not found with username ${req.params.username} and password ${req.params.password}` })
            }
        }
        else {
            res.status(400).send({ message: 'email and password are mandatory' })
        }
    }
    catch (error) {
        res.status(400).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

app.listen(port, () => { console.log(`App listening on ${port}`) })
