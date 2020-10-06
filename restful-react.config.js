/**
 * Please match the config key to the directory under services.
 * This is required for the transform to work
 */
const customGenerator = require('./scripts/swagger-custom-generator.js')

module.exports = {
  portal: {
    output: 'src/services/portal/index.tsx',
    // url: 'https://localhost:9090/api/swagger.json',
    file: 'src/services/portal/swagger.json',
    validation: false,
    transformer: 'scripts/swagger-transform.js',
    customImport: `import { getConfig } from "../config";`,
    customProps: {
      base: `{window.apiUrl || getConfig("api")}`
    }
  },
  'cd-ng': {
    output: 'src/services/cd-ng/index.tsx',
    url: 'http://localhost:7457/swagger.json',
    transformer: 'scripts/swagger-transform.js',
    customImport: `import { getConfig, getUsingFetch, mutateUsingFetch, GetUsingFetchProps, MutateUsingFetchProps } from "../config";`,
    customProps: {
      base: `{getConfig("ng/api")}`
    },
    customGenerator: arg => customGenerator(arg, "getConfig('ng/api')")
  },
  cv: {
    output: 'src/services/cv/index.tsx',
    file: 'src/services/cv/swagger.json',
    transformer: 'scripts/swagger-transform.js',
    customImport: `import { getConfig } from "../config";`,
    customProps: {
      base: `{getConfig("cv-nextgen")}`
    }
  },
  cf: {
    output: 'src/services/cf/index.tsx',
    url: 'http://127.0.0.1:8085/docs/release/admin-v1.yaml',
    transformer: 'scripts/swagger-transform.js',
    customImport: `import { getConfig } from "../config";`,
    customProps: {
      base: `{getConfig("cf")}`
    }
  }
}
