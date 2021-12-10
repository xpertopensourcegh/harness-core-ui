import type { StringKeys } from 'framework/strings'
import { createNewRelicData } from '../NewRelicHealthSourceContainer.util'
import { validateMapping } from '../NewRelicHealthSource.utils'
import {
  sourceData,
  expectedNewRelicData,
  validationMissingApplication,
  validationMissingMetricData,
  validationValidPayload
} from './NewRelic.mock'

function getString(key: StringKeys): StringKeys {
  return key
}

describe('Test Newrelic Utils', () => {
  test('Verify createNewRelicData', () => {
    expect(createNewRelicData(sourceData)).toEqual(expectedNewRelicData)
  })

  test('Verify validate function', () => {
    expect(validateMapping(validationMissingApplication, [], 0, getString)).toEqual({
      newRelicApplication: 'cv.healthSource.connectors.NewRelic.validations.application'
    })
    expect(validateMapping(validationMissingMetricData, [], 0, getString)).toEqual({
      metricData: 'cv.monitoringSources.appD.validations.selectMetricPack'
    })
    expect(validateMapping(validationValidPayload, [], 0, getString)).toEqual({})
  })
})
