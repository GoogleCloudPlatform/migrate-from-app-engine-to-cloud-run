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

  console.log(gaeService);

  let runService = appToRun(gaeService);

  document.getElementById('serviceyaml').value = jsyaml.safeDump(runService['service.yaml']);
  document.getElementById('dockerfile').value = runService['Dockerfile'];
}



bindListeners();
appToRunDOM();