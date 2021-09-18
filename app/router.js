import { Router } from 'express'

import upload from './config/multer.js'
import { handleValidation } from './middlewares.js'
import { sellImage, buyImage, getAllImagesForSale } from './controllers/marketplace.js'
import { sellImageValidator } from './validators.js'

const router = Router()

router.get('/marketplace', getAllImagesForSale)
router.post('/sell', 
sellImageValidator, handleValidation(), 
sellImage)
router.post('/image/:id/buy', buyImage)

export default router
