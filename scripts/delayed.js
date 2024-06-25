// eslint-disable-next-line import/no-cycle
import { sampleRUM, loadScript } from './aem.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

async function loadOneTrustScripts() {
  const scripts = [
    {
      src: 'https://cdn-ukwest.onetrust.com/consent/ef4f40b0-973b-4590-b721-17004da55359/OtAutoBlock.js',
      type: 'text/javascript',
    },
    {
      src: 'https://cdn-ukwest.onetrust.com/scripttemplates/otSDKStub.js',
      type: 'text/javascript',
      charset: 'UTF-8',
      'data-domain-script': 'ef4f40b0-973b-4590-b721-17004da55359',
    },
    {
      content: 'function OptanonWrapper() { }',
      type: 'text/javascript',
    },
  ];

  await Promise.all(scripts.map((script) => loadScript(script.src, script)));
}

const loadDemandBase = async () => {
  await loadScript('https://scripts.demandbase.com/HviY9wSc.min.js', { id: 'demandbase_js_lib', type: 'text/javascript' });
};

loadOneTrustScripts();
loadDemandBase();
