import './loadenv';
import {App, Dialog, FlowDialog, NLPModel, log} from 'deepdialog';
import {loadFileSync, loadFile} from './loadFile';
import {getGifs, displayGifs, randomChoice} from './searchgifsdialog';

log.level = process.env.LOGGER_LEVEL;

log.info('Daily Reading process started. appId: %s appSecret: %s host: %s',
  process.env.DEEPDIALOG_APPID,
  process.env.DEEPDIALOG_APPSECRET,
  process.env.HOST_URL);

async function runJob() {
  var app = await new App({
    appId: process.env.DEEPDIALOG_APPID,
    appSecret: process.env.DEEPDIALOG_APPSECRET,
    hostURL: process.env.HOST_URL,
    mainDialog: 'MainDialog',
    deepDialogServer: process.env.DEEPDIALOG_SERVER_URL // 'http://localhost:3000/'
  });

  //
  // Retrieve all sessions
  //
  var sessions = await app.getSessions();

  //
  // For each session, if user opted in, then do something
  //
  sessions.forEach( async function(session) {

    if (session.globals.SubscriptionOptIn) {
      var gifResults = [];

      gifResults = await getGifs(session, session.globals.SearchTerm);
      await session.send(randomChoice(["Your Gif is here, enjoy!","Sending your daily Gif.","Enjoy your Gif!","Here's your daily Gif."]));
      await displayGifs(session, randomChoice(gifResults));
    }
  });

}

export {runJob};
