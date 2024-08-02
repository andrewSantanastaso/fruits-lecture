require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 3000
const logger = require('morgan')
const methodOverride = require('method-override')
const Fruit = require('./models/fruit')

app.use(express.json())
app.use(logger('tiny'))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))



//*****DATABASE CONNECTION */
mongoose.connect(process.env.MONGO_URI)
mongoose.connection.once('open', () => {
    console.log('MongoDB is running')
})
mongoose.connection.on('error', () => {
    console.log('Error connecting to MongoDB')
})


//CREATE


app.post('/fruits', async (req, res) => {
    req.body.readyToEat === 'on' || req.body.readyToEat === true ?
        req.body.readyToEat = true : req.body.readyToEat = false
    try {
        const createdFruit = await Fruit.create(req.body)
        res.redirect(`fruits/${createdFruit._id}`)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

//NEW
app.get('/fruits/new', async (req, res) => {
    res.render('new.ejs')
})

//READ//

//Index
app.get('/fruits', async (req, res) => {
    try {
        const foundFruits = await Fruit.find({})
        res.render('index.ejs', {
            fruits: foundFruits
        })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

//Show
app.get('/fruits/:id', async (req, res) => {
    try {
        const foundFruit = await Fruit.findOne({ _id: req.params.id })
        res.render('show.ejs', {
            fruit: foundFruit
        })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

//UPDATE
app.put('/fruits/:id', async (req, res) => {
    req.body.readyToEat === 'on' || req.body.readyToEat === true ?
        req.body.readyToEat = true : req.body.readyToEat = false
    try {
        const updatedFruit = await Fruit.findByIdAndUpdate({ _id: req.params.id }, req.body)
        res.redirect(`/fruits/${updatedFruit._id}`)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

app.get('/fruits/:id/edit', async (req, res) => {
    try {
        const foundFruit = await Fruit.findById({ _id: req.params.id })
        res.render('edit.ejs', {
            fruit: foundFruit
        })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})
//DELETE

app.delete('fruits/:id', async (req, res) => {
    try {
        await Fruit.findOneAndDelete({ _id: req.params.id })
            .then((fruit) => {
                res.redirect('/fruits')
            })

    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

//APP LISTEN
app.listen(PORT, () => {
    console.log(`Express is listening on port: ${PORT}`)
})