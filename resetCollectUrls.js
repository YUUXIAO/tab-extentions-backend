const mongodb = require('./mongo.js')
const dbOperations = require('./db.js')

const getAllUser = async () => {
  const userData = await mongodb.findAll('user', {})
  userData.forEach(user => {
    if (user?.collectUrls?.length) {
      const updateCollectUrls = user.collectUrls.map(i => {
        return {
          bookMarkId: null,
          url: i,
        }
      })
      dbOperations.updateUser(user._id, { $set: { collectUrls: updateCollectUrls } })
    }
  })
}

getAllUser()
