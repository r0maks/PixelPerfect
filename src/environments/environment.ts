// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: "AIzaSyDh_H3u9dSc7DWd7AFjwtV8Y2CnBuKzimk",
    authDomain: "pixelperfect.firebaseapp.com",
    databaseURL: "https://pixelperfect.firebaseio.com",
    projectId: "pixelperfect",
    storageBucket: "pixelperfect.appspot.com",
    messagingSenderId: "386462008604"
  }
};
