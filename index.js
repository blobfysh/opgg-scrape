const rp = require('request-promise');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

/*
* @param {string} summoner League username to lookup
* @param {Object} opts Options
*/
exports.getStats = (summoner, opts = {region: 'na', refresh: false}) => {
    var refresh = opts.refresh !== undefined ? opts.refresh : false;
    var region  = opts.region  !== undefined ? opts.region  : 'na';

    if (typeof summoner !== "string") throw new TypeError("Summoner must be a string.");
    if (typeof opts !== "object") throw new TypeError("Opts must be an object.");
    
    var url = `https://${region}.op.gg/summoner/userName=${summoner}`;

    if(region == 'kr'){
        url = `https://www.op.gg/summoner/userName=${summoner}`;
    }
    

    return new Promise(async (resolve, reject) => {
        if(opts.refresh){
            try{
                const browser = await puppeteer.launch();
                const page    = await browser.newPage();
                await page.goto(url);
                await page.click('#SummonerRefreshButton');
                await page.waitFor(1500);

                browser.close();
            }
            catch(err){
                reject(err);
            }
        }

        const html = await rp(url);
        var $ = cheerio.load(html);

        if($(`h2.Title`).text() == "This summoner is not registered at OP.GG. Please check spelling."){
            reject(new Error('Could not find user.'));
        }
        else{
            var userObj = {};

            try{
                /*
                var topChamps = [];
                console.log($(`.TopRanker > .ChampionName`).text());
                $(`.Body .TopRanker`).each((i, element) => {
                    console.log($(element).text())
                    console.log($('.TopRanker ' + element.attribs.class + ' a').attr('data-value'));
                    //topChamps.push($(element + ' > .ChampionName > a').text());
                });
                */
                userObj.name      = $(`div.Information > span.Name:last-of-type`).text();
                userObj.level     = $(`span.Level`).text();
                userObj.avatarURL = "http://" + $(`div.ProfileIcon > img`)[0].attribs.src.substring(2);
                userObj.rank      = $(`.TierRank`).text().replace(/\n?\t/g, '');
                userObj.KDARatio  = $(`.GameAverageStats .KDA .KDARatio .KDARatio`).text().replace(/\n?\t/g, '');
                userObj.KDA       = {
                    kills  : parseFloat($(`.KDA .KDA .Kill`).text().replace(/\n?\t/g, '')).toFixed(6),
                    deaths : parseFloat($(`.KDA .KDA .Death`).text().replace(/\n?\t/g, '')).toFixed(6),
                    assists: parseFloat($(`.KDA .KDA .Assist`).text().replace(/\n?\t/g, '')).toFixed(6)
                }

                if($(`.LeaguePoints`).text() !== ""){
                    userObj.rankedLP = $(`.LeaguePoints`).text().replace(/\s+/g, '');
                }
                else{
                    userObj.rankedLP = 'none';
                }

                resolve(userObj);
            }
            catch(err){
                reject(err);
            }
        }
    });
}