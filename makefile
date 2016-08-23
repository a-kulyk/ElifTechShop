.PHONY: create-dist

#some constants
APP_NAME=EliftechShop
BUILD_DIR=build/Release
BUILD_DIR_BANK=$(BUILD_DIR)/Bank

configure:

create-dist:
	rm -rf $(BUILD_DIR)
	mkdir -p $(BUILD_DIR)
	cp .commit-hash $(BUILD_DIR)/
	# BANK STARTS HERE
	@echo Building application BANK
	mkdir -p $(BUILD_DIR)/Bank/config
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
	tar -cvf $(BUILD_DIR)/${APP_NAME}.tar $(BUILD_DIR_BANK)/** \
	aws/** \
	appspec.yml
	chmod 755 $(BUILD_DIR)/${APP_NAME}.tar
	rm -rf build/Release/Bank
