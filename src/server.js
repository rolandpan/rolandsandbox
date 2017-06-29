import './loadenv';
import {App, log} from 'deepdialog';
import {MainDialog, MainNLP} from './maindialog';
log.level = process.env.LOGGER_LEVEL || 'info';

log.info('appId: %s appSecret: %s host: %s',
  process.env.DEEPDIALOG_APPID,
  process.env.DEEPDIALOG_APPSECRET ? `${process.env.DEEPDIALOG_APPSECRET.slice(0,5)}...` : undefined,
  process.env.HOST_URL);

var app = new App({
  appId: process.env.DEEPDIALOG_APPID,
  appSecret: process.env.DEEPDIALOG_APPSECRET,
  hostURL: process.env.HOST_URL,
  mainDialog: 'MainDialog',
  deepDialogServer: process.env.DEEPDIALOG_SERVER_URL,
  automaticTypingState: true
});

process.on('unhandledRejection', function (e) {
  log.error(e);
});

app.addNLPModels(MainNLP);
app.addDialogs(MainDialog);
app.server.start(process.env.PORT, async function () {
  log.info('Bot started');
  await app.save();
});
