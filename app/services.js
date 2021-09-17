import User from './models/User.js'
import Image from './models/Image.js'

const findOneUser = (filter) => User.findOne(filter)
const findUser = (filter) => User.find(filter)
const updateUserById = (id, update, options = {}) => User.findByIdAndUpdate(id, update, options)
const findUserById = (id) => User.find(id)

const createUser = async (dto) => {
  const user = new User(dto)
  const savedUser = await user.save()
  return user.toJSON()
}

const findOneImage = (filter) => Image.findOne(filter)
const findImage = (filter) => Image.find(filter)
const updateImageById = (id, update, options = {}) => Image.findByIdAndUpdate(id, update, options)
const findImageById = (id) => Image.find(id)

const createImage = async (dto) => {
  const image = new Image(dto)
  const savedImage = await image.save()
  return image.toJSON()
}

export {
    findImage,
    findUser,
    findOneImage,
    findOneUser,
    findImageById,
    findUserById,
    updateImageById,
    updateUserById,
    createImage,
    createUser
}