#!/usr/bin/env bash
cd /home/ubuntu/EliftechShop
chown -R ubuntu:ubuntu Bank
cd Bank
npm install --production
cd ../
