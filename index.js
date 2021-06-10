/*
Copyright 2020 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// TODO, for first gen to second gen, display migration guide.

import { appToRun } from './app-to-run.js';

function bindListeners() {
  const inputs = document.querySelectorAll('.input');
  for(const input of inputs) {
    input.addEventListener('input', appToRunDOM);
  }

  const sqlcheckbox = document.getElementById('gae-cloudsql-use');
  
  sqlcheckbox.addEventListener('change', () => {
    if(sqlcheckbox.checked) {
      document.getElementById('gae-cloudsql-instance-container').style.display = 'block';
    } else {
      document.getElementById('gae-cloudsql-instance-container').style.display = 'none';
    }
});

}

function appToRunDOM() {
  let gaeService = {};
  
  let appyaml = document.getElementById('appyaml').value;

  gaeService['app.yaml'] = jsyaml.safeLoad(appyaml);

  gaeService['project-id'] = document.getElementById('project-id').value;
  gaeService['region'] = document.getElementById('region').value;

  if(document.getElementById('gae-cloudsql-use').value) {
    gaeService['cloudsql-instance'] = document.getElementById('gae-cloudsql-instance').value;
  };

  let runService = appToRun(gaeService);

  if(runService['warnings']) {
    document.getElementById('warnings').style.display = 'block';
    document.getElementById('warnings').innerHTML = '';
    for (const warning of runService['warnings']) {
      const item = document.createElement('li');
      item.innerText = warning.message;
      if(warning.link) {
        const link = document.createElement('a');
        link.innerText = warning.link.text;
        link.href = warning.link.href;
        item.appendChild(link);
      }
      document.getElementById('warnings').appendChild(item);
    }
    document.createElement('li');
  } else {
    document.getElementById('warnings').style.display = 'none';
    document.getElementById('warnings').innerHTML = '';
  }


  if(runService.migrate_to_second_gen || runService.migrate_off_app_engine_apis) {
    document.getElementById('to-run').style.display = 'none';
  } else {
    document.getElementById('to-run').style.display = 'block';
  }
  
  document.getElementById('serviceyaml').value = jsyaml.safeDump(runService['service.yaml']);

  if(runService['Dockerfile']) {
    document.getElementById('dockerfile-container').style.display = 'block';
    document.getElementById('dockerfile').value = runService['Dockerfile'];
  } else {
    document.getElementById('dockerfile-container').style.display = 'none';
  }

  if(runService['Procfile']) {
    document.getElementById('procfile-container').style.display = 'block';
    document.getElementById('procfile').value = runService['Procfile'];
  } else {
    document.getElementById('procfile-container').style.display = 'none';
  }
  
  document.getElementById('gcloud').innerText = runService['gcloud'];
  document.getElementById('make-public').innerText = runService['make-public'];
}



bindListeners();
appToRunDOM();