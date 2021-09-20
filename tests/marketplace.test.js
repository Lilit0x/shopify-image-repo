process.env.NODE_ENV = 'test'

import fs from 'fs'
import chai from 'chai'
import chaiHttp from 'chai-http'
import mongoose from 'mongoose'

import server from '../server.js'
import User from '../app/models/User.js'
import Image from '../app/models/Image.js'
import cloudinary from '../app/config/cloudinary.js'
import { calculateActualPrice } from '../app/utils/transactions.js'

const should = chai.should()
const baseURL = `/api/v1`
chai.use(chaiHttp)

describe('Image Repo', () => {

    beforeEach( () => Promise.all[User.deleteMany({}), Image.deleteMany({})])

    describe('/GET marketplace', () => {
        it('it should list all the images for sale on the marketplace', done => {
            chai.request(server)
                .get(`${baseURL}/marketplace`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.status.should.be.eql('successful')
                    res.body.data.should.be.a('array')
                    done()
                })
        })
    })

    describe('/POST sell image', () => {
        it('should create an image and put it up on the market place for sale', async () => {
            const res = await chai.request(server)
                    .post(`${baseURL}/sell`)
                    .set('Content-Type', 'application/form-data')
                    .field('userName', 'baasit')
                    .field('price', 400)
                    .field('discount', 50)
                    .attach('image', fs.readFileSync(`C:/Users/Eurus/Desktop/AngelFire/internships/shopify/carbon.png`), 'carbon.png')
                    
            res.should.have.status(201)
            res.body.status.should.be.eql('successful')
            res.body.data.should.be.a('object')
            res.body.data.should.have.property('image')
            res.body.data.should.have.property('user')
            const imageOwner = res.body.data.image.owner.toString()
            const userId = res.body.data.user._id.toString()
            imageOwner.should.be.eql(userId)
        })

        it('should not create an image if userName, image or price is not present', async() => {
            const res = await chai.request(server)
                    .post(`${baseURL}/sell`)
                    .set('Content-Type', 'application/form-data')
                    .field('discount', 50)
            res.should.have.status(422)
            res.body.should.have.property('message')
        })
    })

    describe('/POST buy image', () => {
        it('should buy image from the seller', async () => {
            const { secure_url, public_id } = await cloudinary.uploader.upload(`C:/Users/Eurus/Desktop/AngelFire/internships/shopify/carbon.png`, { folder: 'marketplace' })
            const sell = await User.create({ userName: 'abefe'})
            const img = await Image.create({ url: secure_url, cloudinary_id: public_id, price: 150, owner: sell._id })
            
            const res = await chai.request(server)
                    .post(`${baseURL}/image/${img._id.toString()}/buy?buyer_name=musa`)

            res.should.have.status(200)
            res.body.status.should.be.eql('successful')
            const { body: { data: { image, seller, buyer } } } = res
            image.owner.toString().should.be.eql(buyer._id.toString())
            image.purchaseStatus.should.be.eql('sold')
            image.soldBy.toString().should.be.eql(seller._id.toString())

            const actualPrice = calculateActualPrice(image.price, image.discount)
            seller.accountBalance.should.be.eql(sell.accountBalance + actualPrice)
            buyer.accountBalance.should.be.eql(200 - actualPrice)
        })

        it('should return an error if the price of image is greater than the account balence of the buyer', async () => {
            const { secure_url, public_id } = await cloudinary.uploader.upload(`C:/Users/Eurus/Desktop/AngelFire/internships/shopify/carbon.png`, { folder: 'marketplace' })
            const sell = await User.create({ userName: 'abefe2' })
            const img = await Image.create({ url: secure_url, cloudinary_id: public_id, price: 500, owner: sell._id })
            
            const res = await chai.request(server)
                    .post(`${baseURL}/image/${img._id.toString()}/buy?buyer_name=musa2`)

            res.should.have.status(403)
            res.body.should.have.property('message')
            res.body.message.should.be.eql(`Oooff, you don't have enough to buy this image.`)
        })

        it('should return an error if the buyer and user are the same person', async () => {
            const { secure_url, public_id } = await cloudinary.uploader.upload(`C:/Users/Eurus/Desktop/AngelFire/internships/shopify/carbon.png`, { folder: 'marketplace' })
            const sell = await User.create({ userName: 'abefe3' })
            const img = await Image.create({ url: secure_url, cloudinary_id: public_id, price: 200, owner: sell._id })
            
            const res = await chai.request(server)
                    .post(`${baseURL}/image/${img._id.toString()}/buy?buyer_name=${sell.userName}`)

            res.should.have.status(403)
            res.body.should.have.property('message')
            res.body.message.should.be.eql(`You already own this image`)
        })
    })
})