const express = require('express')
const app = express()
const path = require('path')
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
    accessToken: '68eed4bdc73c4a5897f6ed10dd827703',
    captureUncaught: true,
    captureUnhandledRejections: true,
  })
  
rollbar.log('Hello rollbar!')

app.use(express.json())

const students = ['Jimmy', 'Timothy', 'Jimothy']

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api/students', (req, res) => {
    res.status(200).send(students)
    rollbar.info('student list was requested and sent')
})

app.post('/api/students', (req, res) => {
   let {name} = req.body

   const index = students.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
           students.push(name)
           res.status(200).send(students)
       } else if (name === ''){
           res.status(400).send('You must enter a name.')
           rollbar.error('attempted empty student name')
       } else {
           res.status(400).send('That student already exists.')
           rollbar.warning('attempted duplicate student')
       }
   } catch (err) {
       console.log(err)
       rollbar.error(err)
   }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    students.splice(targetIndex, 1)
    res.status(200).send(students)
})

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
