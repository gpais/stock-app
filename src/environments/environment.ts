// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  alpha_advantage_api_key: "My alpha advantage key",
  firebaseConfig : {
    apiKey: "my firebase key",
    authDomain: "my fireabse auth domain",
    projectId: "my firebase proj",
    storageBucket: "my firebase storageBucket",
    messagingSenderId: "my firebase messagingSenderId",
    appId: "my firebase app id",
    measurementId: " my measurementId"
  }

};
