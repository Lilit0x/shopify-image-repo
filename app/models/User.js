import mongoose from 'mongoose'

mongoose.Promise = global.Promise

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true
    },
    images: Array,
    imagesForSale: Array,
    purchases: [
      {
        item: { type: mongoose.Types.ObjectId, ref: 'Image' },
        seller: String,
        purchaseDate: Date
      }
    ],
    accountBalance: {
      type: Number,
      default: 200
    }
  },
  {
    timestamps: true,
    usePushEach: true
  }
)

const User = mongoose.model("User", userSchema)
export default User