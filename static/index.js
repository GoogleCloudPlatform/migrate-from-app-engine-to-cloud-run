import { appToRun } from './app-to-run.js';

function bindListeners() {
  const appTextArea = document.getElementById('appyaml');
  appTextArea.addEventListener('input', appToRunDOM);
}

function appToRunDOM() {
  let appyaml = document.getElementById('appyaml').value;

  let gaeService = {'app.yaml': jsyaml.safeLoad(appyaml)};
  console.log(gaeService);

  let runService = appToRun(gaeService);

  document.getElementById('serviceyaml').value = jsyaml.safeDump(runService['service.yaml']);
}



bindListeners();
appToRunDOM();