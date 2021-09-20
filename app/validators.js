import { body } from 'express-validator'

export const sellImageValidator = [
    body('userName').isString().withMessage('Please include a username'),
    body('price').isNumeric().withMessage('Please include a price'),
    body('discount').optional().isNumeric()
]