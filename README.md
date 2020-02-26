# od-universal-front

## Development
```shell script
npm run start
```

## Build
```shell script
# install docker and make
# docker - https://docs.docker.com/install/
# make - https://www.gnu.org/software/make/

# build and run container
make build-n-run
```

## Test
```
npm run test
```

## Mobile
For mobile version used: https://cordova.apache.org/

At first, go to https://console.firebase.google.com/ create project and save file for Cloud Messaging as:
google-services.json - for android
GoogleService-Info.plist - for ios
in root project dir

Install requirements: https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#installing-the-requirements

Run on phone or android emulator
```shell script
make cordova-run-on-phone-or-emulator-in-ubuntu
```
Or
```shell script
mkdir www || echo "" # create www dir
npm run build-cordova # create build in www dir
cordova platform add android || echo "" # add android platform or skip
cordova requirements android # check req
cordova run android --verbose # run on emulator
```

For connect to local backend: https://github.com/open-dating/od-backend from phone,
you can connect to your network(via wifi), create .env file with backend ip, for example:
```
REACT_APP_HOST=http://192.168.1.65:4300
```

If you cant view pics, in you backend manually set host - create .env file in backend root folder with backend ip:
```
HOST=http://192.168.1.65:4300
```

## Roadmap
* [x] create and add logo
* [x] check fcm notifications
* [ ] fix small layouts bugs
* [ ] add donat page
* [ ] add tos page
* [ ] check translate
* [ ] show more user profile fields in user profile
* [x] add more user profile fields and settings for edit
* [ ] publish version for android in Google Play
* [ ] write more tests
* [x] add multilang support
