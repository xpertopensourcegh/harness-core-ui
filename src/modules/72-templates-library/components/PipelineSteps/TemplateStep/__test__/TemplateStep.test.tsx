import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { factory } from '@pipeline/components/PipelineSteps/Steps/__tests__/StepTestUtil'
import { TemplateStepWidgetWithRef, TemplateStepData } from '../TemplateStepWidget'
const getDefaultStepValues = (): TemplateStepData => {
  return {
    identifier: 'id',
    name: 'name',
    template: { templateRef: 'steptemplate', templateInputs: { type: StepType.SHELLSCRIPT, spec: {} } }
  }
}

describe('<TemplateStep /> tests', () => {
  test('snapshot test', () => {
    const { container } = render(
      <TestWrapper>
        <TemplateStepWidgetWithRef factory={factory} initialValues={getDefaultStepValues()} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
