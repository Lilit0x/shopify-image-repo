import mongoose from 'mongoose'

mongoose.Promise = global.Promise

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true
    },
    cloudinary_id: {
        type: String
    },
   owner: {
        type: mongoose.Types.ObjectId , ref: 'User'
   },
   price: Number,
   discount: {
     type: Number,
     default: 0
   },
   purchaseStatus: {
     type: String,
     enum: ['for sale', 'dispute', 'sold'],
     default: 'for sale'
   },
   soldBy: String
  },
  {
    timestamps: true,
    usePushEach: true
  }
)

const image = mongoose.model("Image", imageSchema)
export default image