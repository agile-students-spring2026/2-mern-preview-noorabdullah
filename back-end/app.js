require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

// a route to handle fetching the About Us page content
app.get('/about', (req, res) => {
  res.json({
    name: 'Noor Abdullah',
    photo: 'https://media.licdn.com/dms/image/v2/D5603AQHlJrFhlep5CA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1707299409283?e=1777507200&v=beta&t=eCyD1H8_KNRYiSpsM5EeOfl1T_KW74JlFNvigqaOzCw',
    paragraphs: [
      'Hi, I\'m Abdullah Noor -- a passionate full-stack developer with a keen interest in building modern web applications using the MERN stack (MongoDB, Express, React, and Node.js).',
      'I am currently studying Interactive Media and enjoy turning complex problems into clean, user-friendly solutions. I love working across the full stack, from designing RESTful APIs on the back end to crafting responsive UIs on the front end.',
      'Outside of coding, I enjoy exploring new technologies, contributing to open-source projects, and continuously expanding my knowledge in the ever-evolving world of software development. I\'m excited to keep growing as a developer and to collaborate with others who share the same passion for technology.',
    ],
    status: 'all good',
  })
})

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
