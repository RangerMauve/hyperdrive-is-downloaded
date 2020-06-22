module.exports = isDownloaded

function isDownloaded (drive, file, cb) {
  return drive.stat(file, { file: true }, (err, stat, trie) => {
    if (err) return cb(err)
    getFeed(drive, stat, trie, (err, feed) => {
      if (err) return cb(err)
      cb(null, feed.has(stat.offset, stat.offset + stat.blocks))
    })
  })
}

function getFeed (drive, stat, trie, cb) {
  if (stat.mount && stat.hypercore) {
    const feed = drive.corestore.get({
      key: stat.mount.key,
      sparse: drive.sparse
    })

    feed.ready((err) => {
      if (err) return cb(err)
      stat.blocks = feed.length
      cb(null, feed)
    })
  } else {
    drive._getContent(trie.feed, (err, contentState) => {
      if (err) return cb(err)
      cb(null, contentState.feed)
    })
  }
}
