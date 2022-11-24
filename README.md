# App Engine to Cloud Run migration tool

**[Open online tool](https://googlecloudplatform.github.io/migrate-from-app-engine-to-cloud-run/)**

Helper tool to migrate an App Engine service to a Cloud Run service.

## How to use

### User interface

* Open index.html or [click here](https://googlecloudplatform.github.io/migrate-from-app-engine-to-cloud-run/)
* Copy paste your `app.yaml`
* Enter other information (project ID, region...)
* Get your Cloud Run configuration file and deployment commands. 

### Programatically

Load the `app-to-run.js` module in your codebase with: 

```
import { appToRun } from './app-to-run.js';
```

Then invoke `appToRun()` with an object containing the App Engine configuration. See [this example](https://github.com/GoogleCloudPlatform/app-engine-cloud-run-converter/blob/master/index.js#L28)

TODO: document the exact API when it is stable.

## Demo

See it in action in this end to end demo on Youtube:

[![App Engine to Cloud Run on Youtube](https://img.youtube.com/vi/XXP6QIS8VME/0.jpg)](https://www.youtube.com/watch?v=XXP6QIS8VME)

This is not an officially supported Google product.
