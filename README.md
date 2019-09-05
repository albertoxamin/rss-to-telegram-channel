# RSS to telegram channel
![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/albertoxamin/rss-to-telegram-channel)
![Docker Pulls](https://img.shields.io/docker/pulls/albertoxamin/rss-to-telegram-channel)

## Enviroment variables:
```
TG=botfather_token
IV_HASH=rhash for telegram iv (not required)
CHANNEL_ID=telegram channel id or username
RSS_URL=feed to fetch posts
```


## Docker
You can start it with docker in one line
```
docker run --name RSS-TG-BOT -d -e TG=botfathertoken \
    -e IV_HASH=rhash_for_telegram_iv \
    -e CHANNEL_ID=telegram_channel_id \
    -e RSS_URL=your_feed_url albertoxamin/rss-to-telegram-channel
```

## Channels powered by this repo

* https://t.me/blogunity3d
* https://t.me/ladigeit

Did you use this bot for your channel? Submit a pull request to add your channel!
!
