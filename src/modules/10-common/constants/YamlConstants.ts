import type { ConnectorInfoDTO, SecretDTOV2 } from 'services/cd-ng'

export enum YamlEntity {
  CONNECTOR = 'CONNECTOR',
  PIPELINE = 'PIPELINE',
  SECRET = 'SECRET',
  ENVIRONMENT = 'ENVIRONMENT',
  INPUT_SET = 'INPUT_SET',
  NOTIFICATION = 'NOTIFICATION',
  STAGE = 'STAGE',
  STEP = 'STEP',
  TRIGGER = 'TRIGGER',
  SECRET_MANAGER = 'SECRET_MANAGER'
}

export type YamlSubEntity = ConnectorInfoDTO['type'] | SecretDTOV2['type']
