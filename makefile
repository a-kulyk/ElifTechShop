.PHONY: create-dist

#some constants
APP_NAME=EliftechShop
BUILD_DIR=build/Release
BUILD_DIR_BANK=$(BUILD_DIR)/Bank
BUILD_DIR_SHOP=$(BUILD_DIR)/Shop
BUILD_DIR_DELIVERY=$(BUILD_DIR)/Delivery

configure:

create-dist:
	rm -rf $(BUILD_DIR)
	mkdir -p $(BUILD_DIR)
	cp .commit-hash $(BUILD_DIR)/
	# BANK STARTS HERE
	@echo Building application BANK
	mkdir -p $(BUILD_DIR)/Bank/config
	mkdir -p $(BUILD_DIR)/Shop
	mkdir -p $(BUILD_DIR)/Delivery
	cd Bank/ && webpack
	@echo Copy folders to Build Dir
	cp Bank/config/config.$(NODE_ENV).json $(BUILD_DIR_BANK)/config/config.$(NODE_ENV).json
	cp Bank/config/index.js $(BUILD_DIR_BANK)/config/index.js
	cp -a Bank/libs $(BUILD_DIR_BANK)/libs
	cp -a Bank/public $(BUILD_DIR_BANK)/public
	cp -a Bank/routes $(BUILD_DIR_BANK)/routes
	cp -a Bank/models $(BUILD_DIR_BANK)/models
	cp Bank/app.js $(BUILD_DIR_BANK)
	cp Bank/package.json $(BUILD_DIR_BANK)
	# BANK ENDS HERE
	# SHOP STARTS HERE
	cd Shop/ && webpack
	ls
	@echo Copy folders to Build Dir
	cp -a Shop/client $(BUILD_DIR_SHOP)/client
	cp -a Shop/server $(BUILD_DIR_SHOP)/server
	cp Shop/app.js $(BUILD_DIR_SHOP)/
	cp Shop/package.json $(BUILD_DIR_SHOP)/
	# SHOP ENDS HERE
	#DELIVERY STARTS HERE
	cd Delivery/ && gulp build
	@echo Copy folders to Build Dir
	cp -a Delivery/common $(BUILD_DIR_DELIVERY)/common
	cp -a Delivery/config $(BUILD_DIR_DELIVERY)/config
	cp -a Delivery/frontend $(BUILD_DIR_DELIVERY)/frontend
	cp -a Delivery/lib $(BUILD_DIR_DELIVERY)/lib
	cp -a Delivery/models $(BUILD_DIR_DELIVERY)/models
	cp -a Delivery/routes $(BUILD_DIR_DELIVERY)/routes
	cp -a Delivery/services $(BUILD_DIR_DELIVERY)/services
	cp -a Delivery/utils $(BUILD_DIR_DELIVERY)/utils
	cp Delivery/app.js $(BUILD_DIR_DELIVERY)/
	cp Delivery/package.json $(BUILD_DIR_DELIVERY)/
	#DELIVERY ENDS HERE
	tar -cvf $(BUILD_DIR)/${APP_NAME}.tar $(BUILD_DIR_BANK)/** \
	aws/** \
	Shop/** \
	Delivery/** \
	appspec.yml
	chmod 755 $(BUILD_DIR)/${APP_NAME}.tar
	rm -rf build/Release/Bank
	rm -rf build/Release/Shop
	rm -rf build/Release/Delivery
