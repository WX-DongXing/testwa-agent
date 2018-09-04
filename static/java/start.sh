#!/bin/sh

type=""
username=""
password=""
node=""
sdk=""
appium=""
resource=""

while getopts "t:u:p:n:s:a:r:" opt; do
    case $opt in
        t)
            type="$OPTARG"
            ;;
        u)
            username="$OPTARG"
            ;;
        p)
            password="$OPTARG"
            ;;
        n)
            node="$OPTARG"
            ;;
        s)
            sdk="$OPTARG"
            ;;
        a)
            appium="$OPTARG"
            ;;
        r)
            resource="$OPTARG"
            ;;
        \?)
            break;;
        esac
done

if [ ! $username ]; then
 echo $username
 echo "-u IS NULL"
 exit 1
fi
if [ ! $password ]; then
 echo "-p IS NULL"
 exit 1
fi

export ANDROID_HOME=$sdk
export PATH=$PATH:$ANDROID_HOME:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

java -jar -server -Xms1024m -Xmx2048m TestwaJar.jar --spring.profiles.active="$type" -Dorg.springframework.boot.logging.LoggingSystem=none --username="$username" --password="$password" --node.excute.path="$node" --ANDROID_HOME="$sdk" --appium.js.path="$appium" --distest.agent.resources="$resource"

#echo $! > tpid

#echo Start Success!