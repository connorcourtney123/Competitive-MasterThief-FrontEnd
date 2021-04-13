const express = require('express')
const app = express()
const rowdy = require('rowdy-logger') //for rowdy-logger
const routesReport = rowdy.begin(app)//for rowdy-logger

const PORT = process.env.PORT || 3001

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