.PHONY: create-dist

#some constants
APP_NAME=EliftechShop
BUILD_DIR=build/Release
BUILD_DIR_BANK=$(BUILD_DIR)/Bank

configure:

create-dist:
	rm -rf $(BUILD_DIR)
	mkdir -p $(BUILD_DIR)
	# BANK STARTS HERE
	@echo Building application BANK
	mkdir -p $(BUILD_DIR)/Bank
	cd Bank/
	webpack
	@echo Copy folders to Build Dir
	cp config/config.$(NODE_ENV).json $(BUILD_DIR_BANK)/config/config.$(NODE_ENV).json
  cp config/index.js $(BUILD_DIR_BANK)/config/index.js
  cp -a libs $(BUILD_DIR_BANK)/libs
	cp -a public $(BUILD_DIR_BANK)/public
	cp -a routes $(BUILD_DIR_BANK)/routes
  cp app.js $(BUILD_DIR_BANK)
	cp package.json $(BUILD_DIR_BANK)
	cd ../
	# BANK ENDS HERE

	tar czvf $(BUILD_DIR)/${APP_NAME}.tar.gz $(BUILD_DIR_BANK)/** \
	aws/** \
	appspec.yml
	chmod 755 $(BUILD_DIR)/${APP_NAME}.tar.gz
