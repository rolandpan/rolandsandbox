//
// Main Dialog
//
// This is the dialog that gets control when your bot starts a new
// session with a user
//

import {FlowDialog, NLPModel} from 'deepdialog';

export const MainNLP = new NLPModel({
  name: 'MainNLP',
  provider:'apiai',
  accessToken: process.env.APIAI_ACCESSKEY_SECRET
});

export const MainDialog = new FlowDialog({
  name: 'MainDialog',
  nlpModelName: 'MainNLP', // if you want an NLP engine
  flows: {
    onStart: [
      "Hello",
      {
        text: "Test quick reply buttons",
        actions: {
          yes: "You said yes!",
          no: "You said no."
        }
      }
    ]
  }
});
