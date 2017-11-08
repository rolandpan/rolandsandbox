import {Dialog,any,log, sleep} from 'deepdialog';
import {MainNLP} from './maindialog';
import {isString} from 'util';

export const SEARCH_RESULT_NUMBER = 3;
export const REFRESH_TOKEN = "aBfZJjzH7YJpo9FqpNwDsUYnlNpq7sCl";

export const SearchGifsDialog = new Dialog({
  name: "SearchGifsDialog"
});

var rp = require('request-promise');

SearchGifsDialog.nlpModelName = 'MainNLP';

SearchGifsDialog.onStart( async function(session) {
  await session.start('PromptDialog', 'get_search_term', {text: "Please enter a search term:"});
});

SearchGifsDialog.onResult('PromptDialog', 'get_search_term', async function(session, text){

  var gifresults = [];

  await session.send(`Searching for gifs related to \"${text}\"...`);

  gifresults = await getGifs(session, text);

  if ((gifresults.length>SEARCH_RESULT_NUMBER)&(!isString(gifresults))) {
    await displayGifs(session, gifresults.slice(0,SEARCH_RESULT_NUMBER));

    await sleep(7500*SEARCH_RESULT_NUMBER);

    await session.set('SearchTerm', text);
    await session.save();

    await session.send({
      text: randomChoice([
        "what do you think?",
        "how did you like these?",
        "here you go...what next?",
        "here they are...what do you want to do?"
      ]),
      actions: [
        {
          type: 'reply',
          text: `Subscribe to \"${text}\"`,
          payload: "subscribe"
        },
        {
          type: 'reply',
          text: `Search more Gifs`,
          payload: "search"
        },
        {
          type: 'reply',
          text: `All set for now.`,
          payload: "exit"
        },
        {
          type: 'reply',
          text: `Unsubscribe`,
          payload: "unsubscribe"
        }
      ]
    });
  }
  else {
    await session.send({
      text: randomChoice([
        "Sorry, but that search returned too few results.",
        "Hmmm...couldn't find much for that search term.",
        "That search term didn't return any results.",
        "I didn't find any Gifs for that term."
      ]),
      actions: [
        {
          type: 'reply',
          text: `Search again`,
          payload: "search"
        },
        {
          type: 'reply',
          text: `All set for now.`,
          payload: "exit"
        }
      ]
    });
  }
});

SearchGifsDialog.onPayload('subscribe', async function (session) {
  await subscribe(session);
});

SearchGifsDialog.onPayload('search', async function (session) {
  await session.start('PromptDialog', 'get_search_term', {text: "Enter search term to see related Gifs:"});
});

SearchGifsDialog.onPayload('unsubscribe', async function (session) {
  await unsubscribe(session);
});

SearchGifsDialog.onPayload('exit', async function(session) {
  await session.send(randomChoice(["No worries!","See you soon.","Catch ya later.","Ciao for now."]));
});

SearchGifsDialog.onIntent('stop_subscription', async function(session) {
  await unsubscribe(session);
});

SearchGifsDialog.onIntent('want_subscription', async function(session) {
  if (session.globals.SearchTerm) {
    await subscribe(session);
  }
  else {
    await session.start('PromptDialog', 'get_search_term', {text: "To subscribe you first need to enter a search term. Please type in a search term for your Gifs:"});
  }
});

SearchGifsDialog.onIntent('search_gifs', async function(session) {
  await session.start('PromptDialog', 'get_search_term', {text: "Enter search term to related Gifs:"});
});

SearchGifsDialog.onIntent('understood', async function(session) {
  await session.send(randomChoice([
    "Let me know if I can do anything else for you!",
    "I'm here if you need.  Just lmk how I can help."
  ]));
});

SearchGifsDialog.onIntent('help', async function(session) {
  await session.send(randomChoice([
    "Sorry you're having trouble.  Just type \"search\" to see gifs.",
    "Apologies if you're having trouble.  A good way to get started is to type \"search\" to find gifs."
  ]));
});

SearchGifsDialog.onIntent('image_input', async function(session) {
  await session.send(randomChoice([
    "Thumbs up to you too!"
  ]));
});

SearchGifsDialog.onIntent('greeting', async function(session) {
  await session.send(randomChoice([
    "Hi!",
    "Hello.",
    "Good to be with you today."
  ]));
});

SearchGifsDialog.onText('reset', async function(session){
  await session.finish();
});
SearchGifsDialog.onText('Reset', async function(session){
  await session.finish();
});


SearchGifsDialog.onPayload(any, async function(session) {
  await session.send(randomChoice([
    "So sorry I didn't get your meaning.  I'm a simple bot that can only understand if you want to subscribe, search or unsubscribe.",
    "Sorry I don't understand...at present I can only deal with subscriptions, searching gifs or unsubscribing.",
    "My apologies, I don't understand your meaning.  I can deal with subscriptions, searching gifs, or unsubscribing."
  ]));
});

//
// functions
//
async function subscribe(session) {
  await session.set('SubscriptionOptIn', true);
  await session.save();
  await session.send(`Ok, you will get a daily Gif for \"${session.globals.SearchTerm}\"`);
}

async function unsubscribe(session) {
  await session.set('SubscriptionOptIn', false);
  await session.save();
  await session.send(randomChoice([
    "Ok, turning off subscriptions for you.",
    "You won't get any more Gifs.",
    "Shutting off your Gif subscription"]));
  await session.send({
    text: randomChoice([
      "Would you like to search for more gifs?",
      "Do you want to find more Gifs?",
      "Are you interested in seeing more Gifs?"
    ]),
    actions: [
      {
        type: 'reply',
        text: `Sure!`,
        payload: "search"
      },
      {
        type: 'reply',
        text: `All good for now.`,
        payload: "exit"
      }
    ]
  });
}

export async function getGifs(session, searchterm) {

  var rawResults;
  var parsedResults;
  var gifResults = [];

  var token = await getAccessToken(REFRESH_TOKEN);

  var requestObject = {
    method: 'GET',
    uri: 'https://api.gfycat.com/v1/gfycats/search?search_text=' + searchterm,
    headers: {"Authorization" : 'Bearer ' + token}
  };

  rawResults = await rp(requestObject);
  parsedResults = JSON.parse(rawResults);


  //
  // select url from object
  // gifURL = full size
  // gif100px = 100 pixel
  // max1mbGif  = 1MB
  //
  if (!(parsedResults.errorMessage == 'No search results')) {
    gifResults = await parsedResults.gfycats.map(function (obj){ return obj.max1mbGif;});
  }

  return gifResults;
}

export async function displayGifs(session, gifs) {

  if (isString(gifs)) {
    await session.send(
      {
        type: "image",
        mediaUrl: gifs,
        mediaType: "image/gif"
      });
  }
  else {
    for (var n=0; n < gifs.length; n++) {
      await session.send(
        {
          type: "image",
          mediaUrl: gifs[n],
          mediaType: "image/gif"
        });
    }
  }
}

export async function getAccessToken( refreshtoken ) {
  var response;
  var token;

  log.debug("Gfycat refresh token: %j", refreshtoken);

  var tokenRequest = {
    method: 'POST',
    uri: 'https://api.gfycat.com/v1/oauth/token',
    body: {
      client_id:"2_ExM9aN",
      client_secret: "RgT6_xtSg8JNQF9o1Y0jtrjCDDR7UXzIo76TwASQlIlAADC7YeKKoGWElc0xgmPd",
      refresh_token: refreshtoken,
      grant_type: "refresh"
    },
    json: true
  };

  response = await rp(tokenRequest);
  log.debug("Token response : %j", response);
  token = response.access_token;
  return token;
}


//
// Randomizing functions
//
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export function randomChoice(arr) {
  return arr[getRandomInt(0, arr.length)];
}

export function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
