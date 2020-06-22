const test = require('tape')
const RAM = require('random-access-memory')
const hyperdrive = require('hyperdrive')

const isDownloaded = require('./')

const FILE = '/example.txt'
const CONTENTS = 'Hello World'

test('Two replicated hyperdrives', (t) => {
  const d1 = create()

  d1.writeFile(FILE, CONTENTS, () => {
    const d2 = create(d1.key)

    d2.once('peer-open', checkNotDownloaded)

    replicate(d1, d2)

    function checkNotDownloaded () {
      isDownloaded(d2, FILE, (err, downloaded) => {
        t.notOk(err, 'No error')
        t.notOk(downloaded, 'Not downloaded yet')
        checkDownloaded()
      })
    }

    function checkDownloaded () {
      d2.download('/', () => {
        isDownloaded(d2, FILE, (err, downloaded) => {
          t.notOk(err, 'No Error')
          t.ok(downloaded, 'Is Downloaded')
          t.end()
        })
      })
    }
  })
})

function create (key) {
  return hyperdrive(RAM, key)
}

function replicate (d1, d2) {
  const s1 = d1.replicate(true)
  const s2 = d2.replicate(false)

  s1.pipe(s2).pipe(s1)
}
