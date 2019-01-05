const axios = require('axios')

const cache = new Map()

exports.match = /j\.mp\/[a-zA-Z0-9]+/

exports.fn = async (url) => {
    const addrid = url.match(/j\.mp\/([a-zA-Z0-9]+)/)[1]
    const full_url = `http://j.mp/${addrid}`
    if (cache.has(addrid)) return cache.get(addrid)
    const result = await axios({
        url: full_url,
        method: 'head',
        maxRedirects: 0,
        responseType: 'stream',
        timeout: 5000,
        validateStatus: () => true
    })
    if (result.status !== 301) return false
    cache.set(addrid, result.headers['location'])
    return result.headers['location']
}
