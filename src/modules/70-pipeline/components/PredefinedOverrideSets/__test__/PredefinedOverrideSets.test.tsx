import React from 'react'
import { render } from '@testing-library/react'
import { PredefinedOverrideSets } from '@pipeline/components/PredefinedOverrideSets/PredefinedOverrideSets'
import type { DeploymentStageElementConfig, StageElementWrapper } from '@pipeline/utils/pipelineTypes'
jest.mock('framework/strings', () => ({
  useStrings: () => ({
    getString: (key: string) => key
  })
}))
const currentStageMock: StageElementWrapper<DeploymentStageElementConfig> = {
  stage: {
    spec: {
      execution: {
        rollbackSteps: undefined,
        steps: []
      },
      infrastructure: {
        allowSimultaneousDeployments: false,
        environment: undefined,
        environmentRef: 'environmentRef',
        infrastructureDefinition: undefined,
        infrastructureKey: 'infrastructureKey',
        useFromStage: undefined
      },
      serviceConfig: {
        service: undefined,
        serviceDefinition: undefined,
        serviceRef: 'serviceRef',
        stageOverrides: {
          artifacts: undefined,
          manifests: undefined,
          variables: undefined,
          useArtifactOverrideSets: ['artifact1', 'artifact2'],
          useManifestOverrideSets: ['manifest1'],
          useVariableOverrideSets: ['variable1', 'variable2']
        },
        useFromStage: undefined
      }
    },
    identifier: 'identifier',
    name: 'name'
  }
}
describe('Test ase for OverrideSetsInputSelector', () => {
  test('Snapshot test OverrideSetsInputSelector - ARTIFACT', () => {
    const artifactContext = 'ARTIFACT'
    const { container } = render(<PredefinedOverrideSets currentStage={currentStageMock} context={artifactContext} />)
    expect(container).toMatchSnapshot('Artifact Context')
  })
  test('Snapshot test OverrideSetsInputSelector - MANIFEST', () => {
    const artifactContext = 'MANIFEST'
    const { container } = render(<PredefinedOverrideSets currentStage={currentStageMock} context={artifactContext} />)
    expect(container).toMatchSnapshot('MANIFEST Context')
  })
  test('Snapshot test OverrideSetsInputSelector - VARIABLE', () => {
    const artifactContext = 'VARIABLES'
    const { container } = render(<PredefinedOverrideSets currentStage={currentStageMock} context={artifactContext} />)
    expect(container).toMatchSnapshot('VARIABLES Context')
  })
})