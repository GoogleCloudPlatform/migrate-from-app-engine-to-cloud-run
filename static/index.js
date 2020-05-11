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

  console.log({gaeService});

  let runService = appToRun(gaeService);

  console.log({runService});
  
  document.getElementById('serviceyaml').value = jsyaml.safeDump(runService['service.yaml']);
  document.getElementById('dockerfile').value = runService['Dockerfile'];
}



bindListeners();
appToRunDOM();