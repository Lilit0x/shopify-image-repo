import asyncHandler from 'express-async-handler'
import createError from 'http-errors'

import { createImage, findOneUser, createUser, findImage, updateUserById, findOneImage, findImageById, findUserById, updateImageById } from '../services.js'
import cloudinary from '../config/cloudinary.js'
import { successResponse } from '../utils/responses.js'
import { calculateActualPrice } from '../utils/transactions.js'

export const sellImage = asyncHandler( async(req, res) => {
    const { price, discount, userName } = req.body
    let user = await findOneUser({ userName })
    if(!user) {
        user = await createUser({ userName })
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'marketplace' })
    const image = await createImage({ 
        url: secure_url, 
        cloudinary_id: public_id, 
        price, discount, 
        owner: user._id, 
    })
    user = await updateUserById(user._id, { imagesForSale: [...user.imagesForSale, image._id], images: [...user.images, image._id]}, { new: true })
    return res.status(201).json(successResponse({image, user}))
})

export const getAllImagesForSale = asyncHandler( async(req, res) => { //add filtering by date later and tags
    const images = await findImage({ purchaseStatus: 'for sale' })
    return res.status(200).json(successResponse(images))
})

export const buyImage = asyncHandler( async(req, res) => {
    const { id } = req.params
    const { buyer_name } = req.query
    if(!buyer_name) {
        throw createError(401, 'Please add your name')
    }

    let buyer = await findOneUser({ userName: buyer_name })
    let image = await findOneImage({ _id: id }).populate('owner')

    if(buyer && image && image.owner._id.toString() === buyer._id.toString()) {
        throw createError(403, 'You already own this image')
    } else if(!image || image.purchaseStatus === 'sold' || image.purchaseStatus === 'dispute') {
        throw createError(404, `Oopsies, this image is not listed on the market place`)
    } else if(!buyer) {
        buyer = await createUser({ userName:  buyer_name })
    }

    const actualPrice = calculateActualPrice(image.price, image.discount)
    if(actualPrice > buyer.accountBalance) {
        throw createError(403, `Oooff, you don't have enough to buy this image.`)
    }

    let seller = image.owner
    image = await updateImageById(image._id, { owner: buyer._id, soldBy: seller._id, purchaseStatus: 'sold' }, { new: true })
    buyer = await updateUserById(
            buyer._id, 
            { 
                purchases: [...buyer.purchases, { item: image._id, seller: seller._id, purchaseDate: Date.now(), sellingPrice: actualPrice }],
                $inc: { accountBalance: -actualPrice } 
            }, 
            { new: true }
        )
    seller = await updateUserById(
            seller._id, 
            { 
                imagesForSale: [...seller.imagesForSale.filter( img => img.toString() !== image._id.toString())],
                images: [...seller.images.filter( img => img.toString() !== image._id.toString())],
                $inc: { accountBalance: actualPrice } 
            },
            { new: true }
        )

    return res.status(200).json(successResponse({ image, seller, buyer }))
})