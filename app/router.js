import { Router } from 'express'

import { sellImage, buyImage, getAllImagesForSale } from './controllers/marketplace.js'

const router = Router()

router.get('/marketplace', getAllImagesForSale)
router.post('/sell', sellImage)
router.post('/image/:id/buy', buyImage)

export default router
