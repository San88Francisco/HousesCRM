const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  console.log('work log');
  res.json({ mes: 'work' })

})

module.exports = router