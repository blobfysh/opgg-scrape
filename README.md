## About
A very basic op.gg scraper for League of Legends player stats.

## Usage
```js
const opggScrape = require('opgg-scrape');

opggScrape.getStats('hide on bush', {region: 'kr', refresh: false}).then(stats => {
  console.log(stats);
});
//=> { name: 'Hide on bush',
//=>   level: '215',
//=>   avatarURL: 'http://opgg-static.akamaized.net/images/profile_icons/profileIcon6.jpg',
//=>   rank: 'Challenger',
//=>   KDARatio: '2.89:1',
//=>   KDA: { kills: '5.412356', deaths: '3.642046', assists: '5.165216' },
//=>   rankedLP: '787LP' }
```
## Possible regions
`na`
`kr`
`oce`
`jp`
`euw`
`eune`
`lan`
`br`
`las`
`ru`
`tr`

### `getStats(username, options)`
```js
options.refresh = true
// Will refresh the users stats before sending updated information. WILL TAKE LONGER.
```


A list of items and their descriptions can be found [here](https://lootcord.com/items).

