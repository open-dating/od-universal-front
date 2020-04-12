
CONT_NAME ?= "od-universal-front"
PORT ?= 4100
no-cache ?= false
DOCKER_USERNAME ?= "opendating"
SENTRY_DSN ?= "https://DUMMY@sentry.io/3271268"
HOST ?= ""

.PHONY: build-docker-image
build-docker-image:
	docker build --no-cache=$(no-cache) . -t $(CONT_NAME) \
	--build-arg HOST="$(HOST)" \
	--build-arg SENTRY_DSN="$(SENTRY_DSN)"

.PHONY: run-docker-image
run-docker-image:
	docker rm --force $(CONT_NAME) || echo ""
	docker run -d -p $(PORT):80 --name $(CONT_NAME) --restart always $(CONT_NAME)
	echo "started at http://localhost:$(PORT)"

.PHONY: build-n-run
build-n-run:
	@$(MAKE) build-docker-image
	@$(MAKE) run-docker-image

.PHONY: cordova-install-requirements-in-ubuntu-for-android
cordova-install-requirements-in-ubuntu-for-android:
	sudo apt install openjdk-8-jre-headless openjdk-8-jdk gradle
	/home/$(USER)/Android/Sdk/tools/bin/sdkmanager "platforms;android-28"
	@echo "___________"
	@echo "Set manually in ~/.bashrc  for open in editor cmd: gedit ~/.bashrc"
	@echo "export ANDROID_HOME=/home/\$$USER/Android/Sdk"
	@echo "export PATH=\$${PATH}:\$$ANDROID_HOME/tools:\$$ANDROID_HOME/platform-tools"
	@echo "export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-amd64"

.PHONY: cordova-run-on-phone-or-emulator-in-ubuntu
cordova-run-on-phone-or-emulator-in-ubuntu:
	mkdir www || echo ""
	npm run build-cordova
	cordova platform add android || echo ""
	cordova requirements android
	cordova run android --verbose
