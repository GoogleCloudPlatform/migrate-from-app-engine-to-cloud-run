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

function appToRun(gaeService) {
  let runService = {
    'service.yaml': {
      'apiVersion': 'serving.knative.dev/v1',
      'kind': 'Service',
      'metadata': {
        'name' : 'default'
      },
      'spec': {
        'template': {
          'metadata': {
            'annotations': {}
          },
          'spec': {
            'containers': [
              {
                'image': 'gcr.io/<YOUR-PROJECT>/image'
              }
            ]
          }
        }
      }
    }
  };

  const extractFunctions = [
    extractName,
    extractEnvVars,
    extractMaxInstances,
    extractConcurrency,
    extractMemory,
    extractMigrateToSecondGen,
    extractDockerfile,
    extractVPCAccess,
  ]
  
  for (const extractFunction of extractFunctions) {
    extractFunction(gaeService, runService);
  }

  return runService;
}


function extractName(gae, run) {
  if(gae['app.yaml']['service']) {
    run['service.yaml']['metadata']['name'] = gae['app.yaml']['service'];
   }
}

function extractEnvVars(gae, run) {
  if(gae['app.yaml']['env_variables']) {
    const envArray = run['service.yaml']['spec']['template']['spec']['containers'][0]['env'] = [];
    for (const key of Object.keys(gae['app.yaml']['env_variables'])) {
      envArray.push({
        'name': key,
        'value': gae['app.yaml']['env_variables'][key]
      })
    }
   }
}

function extractMaxInstances(gae, run) {
  if(gae['app.yaml']['automatic_scaling'] && gae['app.yaml']['automatic_scaling']['max_instances']) {
    run['service.yaml']['spec']['template']['metadata']['annotations']['autoscaling.knative.dev/maxScale'] = gae['app.yaml']['automatic_scaling']['max_instances'].toString(); 
   }
}

function extractConcurrency(gae, run) {
  if(gae['app.yaml']['automatic_scaling'] && gae['app.yaml']['automatic_scaling']['max_concurrent_requests']) {
    run['service.yaml']['spec']['template']['spec']['containerConcurrency'] = gae['app.yaml']['automatic_scaling']['max_concurrent_requests']; 
   }
} 

function extractMemory(gae, run) {
  // see https://cloud.google.com/appengine/docs/standard/#instance_classes

  const instanceClassMemory = {
    'F1': '256Mi',
    'F2': '512Mi',
    'F4': '1Gi',
    'F4_HIGHMEM': '2Gi', 
  }

  if(gae['app.yaml']['instance_class']) {
    const container = run['service.yaml']['spec']['template']['spec']['containers'][0];
    
    container['resources'] = container['resources'] || {'limits': {}};

    container['resources']['limits']['memory'] = instanceClassMemory[gae['app.yaml']['instance_class']]; 
   }
}

function extractMigrateToSecondGen(gae, run) {
  const firstGenRuntimes = ['python27', 'php55'];
  const runtime = gae['app.yaml']['runtime'];
  // "api_version" was deprecated for secnd gen runtimes
  if(gae['app.yaml']['api_version'] || firstGenRuntimes.includes(runtime)) {
    run['migrate-to-second-gen'] = true;
  }
}

function extractDockerfile(gae, run) {
  const runtimeToDockerfile = {
    'nodejs': "TODO",
    'nodejs10': "TODO node 10"
  }

  run['Dockerfile'] = runtimeToDockerfile[gae['app.yaml']['runtime']]
}

function extractVPCAccess(gae, run){
  if(gae['app.yaml']['vpc_access_connector']) {
    // TODO
  }
}

bindListeners();
appToRunDOM();