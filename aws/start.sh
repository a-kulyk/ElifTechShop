#!/usr/bin/env bash
cd /home/ubuntu/EliftechShop/Bank
export NODE_ENV=production
pm2 kill
pm2 start app.js&
cd ../
