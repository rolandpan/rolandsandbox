# starterbot
DeepDialog starter bot

## To start a new project

1. Create a new repo on Github for your new project.

DO NOT initialize the project with any files (such as .gitignore or README)

2. Clone starterbot repo and point origin at your new repo
```
git clone git@github.com:aneilbaboo/deepdialog-starterbot.git {mynewproject}
cd {mynewproject}
git remote set-url origin {new-github-uri}
git push
```

3. Set your environment variables

```
heroku config:set APIAI_ACCESSKEY_SECRET={YOUR APIAI SECRET} DEEPDIALOG_APPID={YOUR DEEPDIALOG APPID} DEEPDIALOG_APPSECRET={YOUR DEEPDIALOG APP SECRET} HOST_URL="http://localhost:3001"
```

4. Set the GIT_SSH_KEY 
This is needed to install the deepdialog node client module
```
heroku config:set GIT_SSH_KEY="{GET THIS VALUE FROM ANEIL}"
```
