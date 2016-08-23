#!/usr/bin/env bash
cd /home/ubuntu/EliftechShop/Bank
export NODE_ENV=production
nonhup npm start &
cd ../
