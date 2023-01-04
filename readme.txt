Application Startup:
    DEV:
        1) open ngrok from desktop
        2) run command 'ngrok http 5000'
        3) copy forwarding url and replace on bungie application settings page (https://www.bungie.net/en/Application/Detail/45586)
            ex. https://2d43-71-183-116-246.ngrok.io
        4) npm start in server directory
        5) npm start in client directory

    DEPLOYING CHANGES:
        1) git add .
        2) git commit -m "<commit message>"
        3) git push heroku master