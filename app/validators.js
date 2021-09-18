import { body } from 'express-validator'

export const sellImageValidator = [
    body('userName').isString(),
    body('price').isNumeric(),
    body('discount').optional().isNumeric()
]