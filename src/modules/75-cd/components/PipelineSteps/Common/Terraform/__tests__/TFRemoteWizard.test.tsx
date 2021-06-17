import React from 'react'

import { fireEvent, render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { TFRemoteWizard } from '../Editview/TFRemoteWizard'

const props = {
  name: 'Terraform Var File Details',
  onSubmitCallBack: jest.fn(),
  isEditMode: false
}
describe('Terraform Remote Form tests', () => {
  test('initial rendering', () => {
    const { container } = render(
      <TestWrapper>
        <TFRemoteWizard {...props} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
  test('should be able to load edit mode correctly', async () => {
    const defaultProps = {
      name: 'Terraform Var File Details',
      onSubmitCallBack: jest.fn(),
      isEditMode: true,
      prevStepData: {
        varFile: {
          identifier: 'test',
          spec: {
            store: {
              spec: {
                gitFetchType: 'pipelineSteps.deploy.inputSet.branch',
                branch: 'test-path',
                paths: ['path1', 'path2']
              }
            }
          }
        }
      }
    }
    const { container } = render(
      <TestWrapper>
        <TFRemoteWizard {...defaultProps} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('should be able to remove and add paths', async () => {
    const defaultProps = {
      name: 'Terraform Var File Details',
      onSubmitCallBack: jest.fn(),
      isEditMode: true,
      prevStepData: {
        varFile: {
          identifier: 'test',
          spec: {
            store: {
              spec: {
                gitFetchType: 'pipelineSteps.deploy.inputSet.branch',
                branch: 'test-path',
                paths: ['path1', 'path2']
              }
            }
          }
        }
      }
    }
    const { container, getByText } = render(
      <TestWrapper>
        <TFRemoteWizard {...defaultProps} />
      </TestWrapper>
    )
    fireEvent.click(getByText('cd.addTFVarFileLabel')!)
    expect(container).toMatchSnapshot()
  })

  test('should be able to load edit mode correctly - with runtime inputs', async () => {
    const defaultProps = {
      name: 'Terraform Var File Details',
      onSubmitCallBack: jest.fn(),
      isEditMode: true,
      prevStepData: {
        varFile: {
          identifier: 'test',
          spec: {
            store: {
              spec: {
                gitFetchType: 'pipelineSteps.deploy.inputSet.branch',
                branch: '<+input>',
                paths: '<+input>'
              }
            }
          }
        }
      }
    }
    const { container } = render(
      <TestWrapper>
        <TFRemoteWizard {...defaultProps} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('should be able to load with commitId edit mode correctly', () => {
    const defaultProps = {
      name: 'Terraform Var File Details',
      onSubmitCallBack: jest.fn(),
      isEditMode: true,
      prevStepData: {
        varFile: {
          identifer: 'test',
          spec: {
            store: {
              spec: {
                gitFetchType: 'pipelineSteps.commitIdValue',
                commitId: 'test-path',
                paths: ['path1', 'path2']
              }
            }
          }
        }
      }
    }
    const { container } = render(
      <TestWrapper>
        <TFRemoteWizard {...defaultProps} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
