#!/usr/bin/env bash
cd /home/ubuntu/EliftechShop
chown -R ubuntu:ubuntu Bank
chown -R ubuntu:ubuntu Shop
chown -R ubuntu:ubuntu Delivery
cd Bank
npm install --production
cd ../
cd Shop
npm install
cd ../
cd Delivery
npm install
cd ../
