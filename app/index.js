import express from 'express'
import config from 'config'
import cors from 'cors'
import userAgent from 'express-useragent'
import helmet from 'helmet'
import morgan from 'morgan'

const app = express()

const middlewares = [
    morgan("dev"),
    helmet(),
    express.json(),
    userAgent.express(),
    cors()
]
// Initialize the middlewares
for (let i = 0; i < middlewares.length; i++) {
    const middleware = middlewares[i]
    if (typeof middleware == "function") {
      app.use(middleware)
    }
}

// app.use(`/api/${config.get('pathPrefix')}${BASE_PATH}`, router)
app.use((error, req, res, next) => {
    // Sets HTTP status code
    res.status(error.status || 500)
    // Sends response
    res.json({
      status: error.status,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : null
    })
  })


export default app