export const YamlEntity = {
  CONNECTOR: 'CONNECTOR',
  PIPELINE: 'PIPELINE',
  SECRET: 'SECRET',
  ENVIRONMENT: 'ENVIRONMENT',
  INPUT_SET: 'INPUT_SET',
  NOTIFICATION: 'NOTIFICATION',
  STAGE: 'STAGE',
  STEP: 'STEP',
  TRIGGER: 'TRIGGER'
}

export const SnippetMenuIcons = new Map<string, string>()
  .set(YamlEntity.ENVIRONMENT, 'yaml-builder-env')
  .set(YamlEntity.INPUT_SET, 'yaml-builder-input-sets')
  .set(YamlEntity.NOTIFICATION, 'yaml-builder-notifications')
  .set(YamlEntity.STAGE, 'yaml-builder-stages')
  .set(YamlEntity.STEP, 'yaml-builder-steps')
  .set(YamlEntity.TRIGGER, 'yaml-builder-trigger')
