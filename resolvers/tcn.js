const axios = require('axios')

const cache = new Map()

exports.match = /t\.cn\/[a-zA-Z0-9]+/

exports.fn = async (url) => {
    const addrid = url.match(/t\.cn\/([a-zA-Z0-9]+)/)[1]
    const full_url = `http://t.cn/${addrid}`
    if (cache.has(addrid)) return cache.get(addrid)
    const result = await axios({
        url: full_url,
        method: 'get',
        maxRedirects: 0,
        responseType: 'stream',
        timeout: 5000,
        validateStatus: () => true
    })
    if (result.status !== 302) return false
    cache.set(addrid, result.headers['location'])
    return result.headers['location']
}
