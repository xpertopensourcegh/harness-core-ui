/**
 * Please match the config key to the directory under services.
 * This is required for the transform to work
 */
module.exports = {
  portal: {
    output: 'src/services/portal/index.tsx',
    file: 'src/services/portal/swagger.json',
    transformer: 'scripts/swagger-transform.js',
    customProps: {
      base: '{"/api"}'
    }
  },
  'cd-ng': {
    output: 'src/services/cd-ng/index.tsx',
    file: 'src/services/cd-ng/swagger.json',
    transformer: 'scripts/swagger-transform.js',
    customProps: {
      base: '{"/cd/api"}'
    }
  }
}
