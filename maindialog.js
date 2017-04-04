//
// Main Dialog
//
// This is the dialog that gets control when your bot starts a new
// session with a user
//

import {Dialog, NLPModel} from 'deepdialog';

export const MainNLP = new NLPModel({
  name: 'MainNLP',
  provider:'apiai',
  accessToken: process.env.APIAI_ACCESSKEY_SECRET
});

export const MainDialog = new Dialog({
  name: 'MainDialog',
  description: 'The top level dialog of your bot'
});

MainDialog.nlpModelName = 'MainNLP';

// MainDialog.onStart(async function (session) {
//
// });
// MainDialog.onIntent(async (session, entities) {
//   session.respond("Hello");
// });
//
// Basic intent handlers
//

// MainDialog.onIntent('help', async function (session) {
//   await session.start('MyHelpDialog');
// });
