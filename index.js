const { Telegram } = require('telegraf')
const Parser = require('rss-parser')

const telegram = new Telegram(process.env.TG)

let parser = new Parser()
let lastDate

const GetInstantView = (link) => `https://t.me/iv?url=${link}&rhash=${process.env.IV_HASH}`
const GetLinks = (feedUrl) => {
	parser.parseURL(feedUrl, function (err, feed) {
		if (err) {
			return console.log(err)
		}
		feed.items.forEach(function (entry) {
			let m
			if (lastDate == undefined || new Date(entry.isoDate) > lastDate) {
				console.log(`[${entry.isoDate}] ${entry.link}`)
				PostNews(entry.link)
			}
		})
		lastDate = new Date()
	})
}

const PostNews = (link) => {
	telegram.sendMessage(process.env.CHANNEL_ID, `[${link}](${GetInstantView(link)})`, Object.assign({ 'parse_mode': 'Markdown' }))
		.then(message => {
			console.log(`[${new Date().toUTCString()}] Posted ${link}`)
		}).catch(err => console.error(err))
}

const FetchPosts = () => {
	GetLinks(process.env.RSS_URL)
	console.log(`[${new Date().toUTCString()}] Fetching RSS`)
}

FetchPosts()
setInterval(FetchPosts, 1000 * 60 * 60)