import config from 'config'
import cloudinary from 'cloudinary'

cloudinary.v2.config({ 
    cloud_name: config.get('cloud_name'), 
    api_key: config.get('cloudinary_api_key'),
    api_secret: config.get('cloudinary_api_secret') 
})

export default cloudinary.v2