/**
 * Please match the config key to the directory under services.
 * This is required for the transform to work
 */
module.exports = {
  portal: {
    output: 'src/services/portal/index.tsx',
    url: 'https://localhost:9000/api/swagger.json',
    // file: 'src/services/portal/swagger.json',
    transformer: 'scripts/swagger-transform.js',
    customProps: {
      base: '{"/api"}'
    }
  },
  'cd-ng': {
    output: 'src/services/cd-ng/index.tsx',
    url: 'http://localhost:7457/swagger.json',
    // file: 'src/services/cd-ng/swagger.json',
    transformer: 'scripts/swagger-transform.js',
    customProps: {
      base: '{"/cd/api"}'
    }
  }
}
