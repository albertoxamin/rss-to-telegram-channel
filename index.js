const updateInterval = process.env.UPDATE_INTERVAL ? process.env.UPDATE_INTERVAL : 60;
const { Telegram } = require('telegraf')
const Parser = require('rss-parser')
const fs = require('fs');
const { rejects } = require('assert');
console.log(process.env.CHANNEL_ID)
const telegram = new Telegram(process.env.TG)

let parser = new Parser()
let lastLinks = []

if (!fs.existsSync('lastCheck.txt'))
	fs.writeFileSync('lastCheck.txt', process.env.STARTING_DATE ? process.env.STARTING_DATE : new Date().toISOString())

const GetMessage = (link) => process.env.IV_HASH ? `[️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️](https://t.me/iv?url=${link}&rhash=${process.env.IV_HASH}) ${link}` : link

const Parse = (feedUrl, lastDate) => {
	return new Promise((resolve, reject)=> {
		parser.parseURL(feedUrl, function (err, feed) {
			if (err) {
				return console.log(err)
			}
			console.log(`[${new Date().toUTCString()}] Parsing ${feedUrl}`)
			let skipped = 0
			feed.items.forEach(function (entry) {
				let m
				// console.log(`${new Date(entry.isoDate)} > ${lastDate} --> ${new Date(entry.isoDate) > lastDate}`)
				if ((lastDate == undefined || new Date(entry.isoDate) > lastDate) && lastLinks.indexOf(entry.link) === -1) {
					console.log(`[${entry.isoDate}] ${entry.link}`)
					lastLinks.push(entry.link)
					if (lastLinks.length > 10)
						lastLinks.shift() // this should avoid some cases with bad rss feeds
					PostNews(entry.link)
				} else {
					skipped++
				}
			})
			console.log(`[${new Date().toUTCString()}] Done parsing ${feedUrl}, skipped: ${skipped}`)
			resolve()
		})
	})
}

const GetLinks = (feedUrl) => {
	let lastDate = (fs.existsSync('lastCheck.txt')) ? new Date(fs.readFileSync('lastCheck.txt').toString()) : undefined
	
	let feeds = feedUrl.split(' ')
	if (feeds.length == 1) {
		Parse(feedUrl, lastDate).then(()=>{
			fs.writeFileSync('lastCheck.txt', new Date().toISOString())
		})
	}
	else {
		(async () => {
			while (feeds.length > 0) {
				await Parse(feeds[0], lastDate)
				feeds.shift()
			}
			fs.writeFileSync('lastCheck.txt', new Date().toISOString())
		})()
	}
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