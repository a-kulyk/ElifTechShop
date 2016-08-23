#!/usr/bin/env bash
HASH=`cat /home/ubuntu/EliftechShop/.commit-hash`
#HASH=0
function notifySlack {
    status=$1
    emoji=$2
    webHookUrl="https://hooks.slack.com/services/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"

    slackChannel="deployments"

    if [ "$status" == "success" ] ; then
        color="#2FA44F"
    else
        color="#D50200"
    fi

    curl -X POST --data-urlencode 'payload={"channel": "#'$slackChannel'", "username": "CodeDeploy EliftechShop '$DEPLOYMENT_GROUP_NAME'", "attachments": [ { "color": "'$color'", "text": "<https://eu-west-1.console.aws.amazon.com/codedeploy/home?region=eu-west-1#/deployments/'$DEPLOYMENT_ID'|Deployment> '$status' on the instance. Commit: <https://bitbucket.org/reactmobileapp/mobileapp-api/commits/'$HASH'|'${HASH:0:7}'>" } ], "icon_emoji": "'$emoji'"}' $webHookUrl
}

result=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ping)

if [[ "$result" == "200" ]]; then
    notifySlack 'success' ':yay:'
    exit 0
else
    notifySlack 'failure' ':interrobang:'
    exit 1
fi
