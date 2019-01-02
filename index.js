const fs = require('fs')

const MAX_DEPTH = 6

const resolvers_filename = fs.readdirSync(__dirname + '/resolvers', { withFileTypes: true }).filter(n => n.isFile() && n.name.endsWith('.js')).map(n => `${__dirname}/resolvers/${n.name}`)

const resolvers = []

for (const r of resolvers_filename) {
    const { match, fn } = require(r)
    resolvers.push([match, fn])
}

function findAMatch(url) {
    for (const [m, fn] of resolvers) {
        if (m.test(url)) return fn
    }
}

exports.resolve = async (link) => {
    const affected_urls = []
    affected_urls.push(link)
    let current_link = link
    for (let hasMatch = findAMatch(current_link); hasMatch;) {
        if (affected_urls.indexOf(current_link) > -1) break
        if (affected_urls.length > MAX_DEPTH) break
        const result = await hasMatch(current_link)
        if (!result) break
        affected_urls.push(result)
        current_link = result
    }
    return affected_urls
}
