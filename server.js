const express = require('express')
const app = express()
const rowdy = require('rowdy-logger') //for rowdy-logger
const routesReport = rowdy.begin(app)//for rowdy-logger


app.use(express.json())//allow for use of req.body


//listen on port 3001
app.listen(3001, () => {
  console.log('the server is listening!')
	routesReport.print()
})
