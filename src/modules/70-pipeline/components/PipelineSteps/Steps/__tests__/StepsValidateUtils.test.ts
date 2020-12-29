import { renderHook } from '@testing-library/react-hooks'
import { get } from 'lodash-es'
import { useValidate, Types } from '../StepsValidateUtils'

const strings = {
  validation: {
    identifierRequired: 'Identifier is a required field',
    stepNameRequired: 'Step Name is a required field',
    connectorRefRequired: 'Container Registry is a required field',
    imageRequired: 'Image is a required field',
    commandRequired: 'Command is a required field'
  }
}

jest.mock('framework/exports', () => ({
  useStrings: jest.fn(() => ({
    getString: (string: string) => get(strings, string)
  }))
}))

const fields = [
  {
    name: 'identifier',
    type: Types.Identifier,
    required: true
  },
  {
    name: 'name',
    type: Types.Name,
    required: true
  },
  {
    name: 'spec.connectorRef',
    type: Types.ConnectorRef,
    required: true
  },
  {
    name: 'spec.image',
    type: Types.Image,
    required: true
  },
  {
    name: 'spec.command',
    type: Types.Command,
    required: true
  },
  {
    name: 'spec.reportPaths',
    type: Types.ReportPaths
  },
  {
    name: 'spec.envVariables',
    type: Types.EnvVariables
  },
  {
    name: 'spec.outputVariables',
    type: Types.OutputVariables
  },
  {
    name: 'spec.limitMemory',
    type: Types.LimitMemory
  },
  {
    name: 'spec.limitCPU',
    type: Types.LimitCPU
  },
  {
    name: 'timeout',
    type: Types.Timeout
  }
]

describe('StepValidateUtils', () => {
  describe('useValidate', () => {
    test('should return errors for required fields', () => {
      const {
        result: { current: validate }
      } = renderHook(() => useValidate(fields))

      const result = validate({})

      expect(result).toEqual({
        identifier: 'Identifier is a required field',
        name: 'Step Name is a required field',
        spec: {
          connectorRef: 'Container Registry is a required field',
          image: 'Image is a required field',
          command: 'Command is a required field'
        }
      })
    })
  })
})
