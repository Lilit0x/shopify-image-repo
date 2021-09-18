import { validationResult } from 'express-validator'
import createError from 'http-errors'

export const handleValidation = () => {
	return (req, res, next) => {
		const errors = validationResult(req)
		if (errors.isEmpty()) {
		  return next()
		} else {
			console.log(errors.array())
			const firstError = errors.array({ onlyFirstError: true })[0]		
			throw createError(422, firstError.msg, firstError)
		}  
	}
}
  

