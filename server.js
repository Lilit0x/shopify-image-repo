import chalk from 'chalk' 
import config from 'config'

import app from './app/index.js'
import connectToDB from './app/config/db.js'

// connect to DB
connectToDB()

const port = process.env.PORT || config.get('port') || 3000

// listen for requests
const server = app.listen(port, async () => {
	const appName = chalk.magenta(config.get('appName'))
	const mark = chalk.green("✓")
	const url = chalk.blue(`${config.get('siteURL')}:${port}`)
	const env = chalk.yellow(process.env.NODE_ENV)
	process.env.API_ADDRESS = `${config.get('siteURL')}:${port}`
	if (process.env.NODE_ENV != "test") {
		console.log(chalk.bold(`${mark} ${appName} is running at ${url} in ${env} mode`))
		console.log(chalk.blue.bold("✗ Press CTRL-C to stop\n"))
	}
})

// marketplace
// add image to market place
// buy from market place
// upload image to be sold
// handle inventory
// negotiate price
// search market place based on price, and other filters
