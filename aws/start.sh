#!/usr/bin/env bash
cd /home/ubuntu/EliftechShop/Bank
export NODE_ENV=production
pm2 start app.js
cd ../
cd Shop/
pm2 start app.js
cd ../
cd Delivery/
pm2 start app.js
cd ../