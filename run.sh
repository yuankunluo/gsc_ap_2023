#/bin/bash

nohup npm run start > server.log 2>&1 & echo $! > pid.log