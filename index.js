const updateInterval = process.env.UPDATE_INTERVAL ?? 60
const { Telegram } = require('telegraf')
const Parser = require('rss-parser')
const fs = require('fs')

const telegram = new Telegram(process.env.TG)

let parser = new Parser()
let lastLinks = []

if (!fs.existsSync('lastCheck.txt'))
	fs.writeFileSync('lastCheck.txt', process.env.STARTING_DATE)

const GetMessage = (link) => process.env.IV_HASH ? `[️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️](https://t.me/iv?url=${link}&rhash=${process.env.IV_HASH}) ${link}` : link
const GetLinks = (feedUrl) => {
	parser.parseURL(feedUrl, function (err, feed) {
		if (err) {
			return console.log(err)
		}
		var lastDate = (fs.existsSync('lastCheck.txt')) ? new Date(parseInt(fs.readFileSync('lastCheck.txt').toString())) : undefined
		feed.items.forEach(function (entry) {
			let m
			if ((lastDate == undefined || new Date(entry.isoDate) > lastDate) && lastLinks.indexOf(entry.link) === -1) {
				console.log(`[${entry.isoDate}] ${entry.link}`)
				lastLinks.push(entry.link)
				if (lastLinks.length > 10)
					lastLinks.shift() // this should avoid some cases with bad rss feeds
				PostNews(entry.link)
			}
		})
		fs.writeFileSync('lastCheck.txt', Date.now())
	})
}

const PostNews = (link) => {
	telegram.sendMessage(process.env.CHANNEL_ID, GetMessage(link), Object.assign({ 'parse_mode': 'Markdown' }))
		.then(message => {
			console.log(`[${new Date().toUTCString()}] Posted ${link}`)
		}).catch(err => console.error(err))
}

const FetchPosts = () => {
	GetLinks(process.env.RSS_URL)
	console.log(`[${new Date().toUTCString()}] Fetching RSS`)
}

FetchPosts()
setInterval(FetchPosts, 1000 * 60 * updateInterval)