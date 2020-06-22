# hyperdrive-is-downloaded
Check if a hyperdrive has downloaded a given file locally.

## Usage

`npm i --save hyperdrive-is-downloaded`

```js
const isDownloaded = require('hyperdrive-is-downloaded`)

const drive = getHyperdriveSomehow()

isDownloaded(drive, '/example.txt', (err, downloaded) => {
	if(err) handleYourErrors(err)
	else console.log('Is file downloaded:', downloaded)
})
```
