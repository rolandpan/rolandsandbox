import {Dialog,any} from 'deepdialog';

export const PromptDialog = new Dialog({
  name: "PromptDialog"
});


PromptDialog.onStart(async (session, vars) => {
  if (vars && vars.text) {
    await session.send(vars.text);
  }
});

PromptDialog.onText(any, async (session, text) => {
  session.finish(text);
});
