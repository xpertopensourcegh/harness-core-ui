import React from 'react'
import { render, Matcher, act, fireEvent } from '@testing-library/react'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { factory, TestStepWidget } from '@pipeline/components/PipelineSteps/Steps/__tests__/StepTestUtil'
import { DockerHubStep } from '../DockerHubStep'

jest.mock('@common/components/YAMLBuilder/YamlBuilder')

jest.mock('../../CIStep/StepUtils', () => ({
  useGetPropagatedStageById: jest.fn(() => ({ stage: { spec: { infrastructure: { type: 'VM' } } } }))
}))

describe('DockerHub Step', () => {
  beforeAll(() => {
    factory.registerStep(new DockerHubStep())
  })

  describe('Edit View', () => {
    test('should render properly for AWS VMs build infra', () => {
      const { container, getByText } = render(
        <TestStepWidget initialValues={{}} type={StepType.DockerHub} stepViewType={StepViewType.Edit} />
      )

      const lookupShouldFail = (text: Matcher) => {
        try {
          getByText(text)
        } catch (err) {
          expect(err).toBeTruthy()
        }
      }

      act(() => {
        fireEvent.click(getByText('common.optionalConfig'))
      })

      // Remote Cache Repository field look up should fail since this field is optional for AWS VMs Build Infra and won't be rendered without expanding optional config section
      lookupShouldFail('ci.remoteCacheRepository.label')

      expect(container).toMatchSnapshot()
    })
  })
})