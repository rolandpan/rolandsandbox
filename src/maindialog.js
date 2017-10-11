//
// Main Dialog
//
// This is the dialog that gets control when your bot starts a new
// session with a user
//

import {Dialog, FlowDialog, NLPModel, log, any} from 'deepdialog';
import {loadFileSync, loadFile} from './loadFile';

var rp = require('request-promise');

export const MainNLP = new NLPModel({
  name: 'MainNLP',
  provider:'apiai',
  accessToken: process.env.APIAI_ACCESSKEY_SECRET
});

var flowObject = loadFileSync("onboardflow.YML");
var intents = loadFileSync("intents.json");

var apiaiRequest = {
  url: 'https://api.api.ai/v1/intents/d8a6d158-db2e-4d70-8d77-6130740cc327?v=20150910',
  headers: {
    'Authorization': 'Bearer fde172ff5bb64efeb51ae224fdc4c44c'
  }
};

/*
export const MainDialog = new Dialog({
  name: 'MainDialog',
  description: 'The top level dialog of your bot'
});
*/

export const MainDialog = new FlowDialog({
  name: 'MainDialog',
  flows: flowObject
});

/*
export const MainDialog = new FlowDialog({
  name: 'MainDialog',
  flows:  {
    onStart: [
      'First line',
      {
        text: "Call dialog test",
        actions: {
          'test dialog': [
            {
              start: ['PromptDialog',{text: "Enter search term:"}],
              then: "You typed {{value}}"
            }
          ],
          'other stuff': "bye"
        }
      }
    ]
  }
});
*/


/*
export const MainDialog = new FlowDialog({
  name: 'MainDialog',
  flows:  {
    onStart: [
      "carousel test",
      {
        type: "list",
        items: {
          item1: {
            title: "this is item1",
            caption: "this is item1 desc",
            mediaUrl: "http://i.imgur.com/YRCG8eP.jpg",
            mediaType: "image",
            actions: {
              website: {
                uri: "http://www.deepdialog.ai"
              },
              Friends: {
                type: "share"
              }
            }
          },
          item2: {
            title: "this is item2",
            description: "this is item2 desc",
            mediaUrl: "http://i.imgur.com/YRCG8eP.jpg",
            actions: {
              website: {
                uri: "http://www.deepdialog.ai"
              },
              Friends: {
                type: "share"
              }
            }
          }
        }
      }
    ]
  }
});
*/

/*
MainDialog.onStart( async function(session) {
  await session.send('Hello..testing.');
});
*/

MainDialog.nlpModelName = 'MainNLP';


/*
MainDialog.onIntent('basics.view_account_num', async function (session) {
  await session.send({text: 'You can find your full account number within your electronic statements online. To view these, log in to online banking and select “Online Statements.” You can then preview each account statement and view your account numbers.'});
});
*/

/*
basics.change_pwd_or_uid
basics.change_security_questions
basics.download_acct_info
basics.how_much_trx_history
basics.nickname_accts
basics.view_account_num
basics.view_which_statements
basics.what_is_id_verification
*/

MainDialog.onText('reset', resetBot);
MainDialog.onText('Reset', resetBot);

MainDialog.onText(any, async function (session) {
  session.start('SearchGifsDialog', 'restart');
});

MainDialog.onText('set', async function (session){
  var viewedGifs = [];
  viewedGifs.push('https://zippy.gfycat.com/HopefulEasygoingCony.gif');
  session.set('ViewedGifs',viewedGifs);
  session.save();
});

MainDialog.onText('push', async function (session){
  var viewedGifs = await session.globals.ViewedGifs;
  viewedGifs.push('https://giant.gfycat.com/LightheartedCalculatingBackswimmer.gif');
  session.set('ViewedGifs',viewedGifs);
  session.save();
});

// array.indexOf(xx) to check if in viewedGifs

MainDialog.onText('test', async function (session, text){
  log.debug("flowObject : %j", flowObject);
  log.debug("intents :%j", intents);
  var body = await request(apiaiRequest);
  var intentObj = JSON.parse(body);
  var utteranceObj = {"data": [{"text":"new text"}]};
  intentObj.userSays.push(utteranceObj);
  log.debug("intentObj.userSays :%j", intentObj.userSays);
  var apiaiPut = {
    method: 'PUT',
    url: 'https://api.api.ai/v1/intents/d8a6d158-db2e-4d70-8d77-6130740cc327?v=20150910',
    headers: {
      'Authorization': 'Bearer fde172ff5bb64efeb51ae224fdc4c44c',
      'Content-Type': 'application/json; charset=utf-8'
    },
    json: intentObj
  };
  var response = await request(apiaiPut);
  log.debug("response : %j", response);
  log.debug("text : %j", text);
  await session.send('got test');
});

addIntentResponses(MainDialog, intents);

MainDialog.onText('Hi', resetBot);
MainDialog.onText('reset', resetBot);
MainDialog.onText('Reset', resetBot);
async function resetBot(session) {
  await session.send("Restarting...");
  await session.reset();
  await MainDialog.startFlow('onStart', session);
}

function addIntentResponses(dialog, intentMap) {
  for (let intent in intentMap) {
    dialog.onIntent(intent, async (session) => await session.send(intentMap[intent]));
  }
}

async function request(inputRequest) {
  return rp(inputRequest);
}
