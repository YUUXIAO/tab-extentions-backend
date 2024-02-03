const express = require("express")
const app = express()

// import addHistory from './index.js'

const {addHistory} = require('./index.js')

app.get('/api', (req, res) => {
    console.log('11',req);
    const {keyword} = req.query
    addHistory(keyword)
    res.send('成功取到 keyword');
  });

app.listen(3000, () => {
    console.log('Server started on port 3000');
  });