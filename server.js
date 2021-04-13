const express = require('express')
const app = express()
const rowdy = require('rowdy-logger') //for rowdy-logger
const routesReport = rowdy.begin(app)//for rowdy-logger

const PORT = process.env.PORT || 3000

app.use(express.json())//allow for use of req.body


//listen on port 3001
app.listen(PORT, () => {
  console.log('the server is listening!')
	routesReport.print()
})
// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 3001;
// }
// app.listen(port);
// HELLO
app.use(async (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    await replaceInFile({
      files: filepath,
      from: 'http://localhost:3000',
      to: 'https://gentle-peak-73931.herokuapp.com'
    })
  }
  next()
})
app.use(express.static('public'))
