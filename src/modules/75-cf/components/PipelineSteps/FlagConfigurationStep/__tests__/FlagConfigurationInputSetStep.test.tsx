import React from 'react'
import { render, RenderResult, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestWrapper } from '@common/utils/testUtils'
import * as cfServices from 'services/cf'
import type { Feature } from 'services/cf'
import FlagConfigurationInputSetStep, { FlagConfigurationInputSetStepProps } from '../FlagConfigurationInputSetStep'

const mockFeatures = [
  { name: 'Feature 1', identifier: 'f1' },
  { name: 'Feature 2', identifier: 'f2' },
  { name: 'Feature 3', identifier: 'f3' }
] as Feature[]

const renderComponent = (props: Partial<FlagConfigurationInputSetStepProps> = {}): RenderResult =>
  render(
    <TestWrapper>
      <FlagConfigurationInputSetStep
        environment="qa"
        initialValues={{} as FlagConfigurationInputSetStepProps['initialValues']}
        template={{} as FlagConfigurationInputSetStepProps['template']}
        path="test"
        {...props}
      />
    </TestWrapper>
  )

describe('FlagConfigurationInputSetStep', () => {
  let useGetAllFeaturesMock: jest.SpyInstance

  beforeEach(() => {
    useGetAllFeaturesMock = jest
      .spyOn(cfServices, 'useGetAllFeatures')
      .mockReturnValue({ data: [], loading: false, error: null, refetch: jest.fn() } as any)
  })

  describe('Select feature', () => {
    const template = {
      spec: { feature: '<+input>' }
    } as FlagConfigurationInputSetStepProps['template']

    test('it should display the features select when the template spec value is set as runtime', async () => {
      renderComponent({ template })

      expect(screen.getByText('cf.pipeline.flagConfiguration.selectFlag')).toBeInTheDocument()
    })

    test('it should not display the features select when the template spec value set as static', async () => {
      const staticTemplate = {
        spec: { feature: 'something else' }
      } as FlagConfigurationInputSetStepProps['template']
      renderComponent({ template: staticTemplate })

      expect(screen.queryByText('cf.pipeline.flagConfiguration.selectFlag')).not.toBeInTheDocument()
    })

    test('it should display the error if the features fail to load', async () => {
      const errorMessage = 'TEST ERROR MESSAGE'
      const refetchMock = jest.fn()
      useGetAllFeaturesMock.mockReturnValue({
        data: [],
        loading: false,
        error: { data: { message: errorMessage } },
        refetch: refetchMock
      })

      renderComponent({ template })

      expect(screen.queryByText('cf.pipeline.flagConfiguration.selectFlag')).not.toBeInTheDocument()
      expect(screen.getByText(errorMessage)).toBeInTheDocument()

      const btn = screen.getByRole('button', { name: 'Retry' })
      expect(btn).toBeInTheDocument()
      expect(refetchMock).not.toHaveBeenCalled()

      userEvent.click(btn)

      await waitFor(() => expect(refetchMock).toHaveBeenCalled())
    })

    test('it should display the returned features', async () => {
      useGetAllFeaturesMock.mockReturnValue({
        data: { features: mockFeatures },
        loading: false,
        error: null,
        refetch: jest.fn()
      })

      renderComponent({ template })

      const field = screen
        .getByText('cf.pipeline.flagConfiguration.selectFlag')
        ?.parentElement?.querySelector('input') as HTMLInputElement
      expect(field).toBeInTheDocument()

      userEvent.click(field)

      await waitFor(() => {
        mockFeatures.forEach(({ name }) => expect(screen.getByText(name)).toBeInTheDocument())
      })
    })

    test('it should try to search for features when the user types', async () => {
      const flagSearch = 'TEST FLAG SEARCH'
      const refetchMock = jest.fn()
      useGetAllFeaturesMock.mockReturnValue({ data: [], loading: false, error: null, refetch: refetchMock })

      renderComponent({ template })

      const field = screen
        .getByText('cf.pipeline.flagConfiguration.selectFlag')
        ?.parentElement?.querySelector('input') as HTMLInputElement
      expect(field).toBeInTheDocument()
      expect(refetchMock).not.toHaveBeenCalled()

      await userEvent.type(field, flagSearch)

      await waitFor(() => {
        expect(refetchMock).toBeCalledWith(
          expect.objectContaining({
            queryParams: expect.objectContaining({ name: flagSearch })
          })
        )
      })
    })

    test('it should disable the input if readonly is set', async () => {
      renderComponent({ template, readonly: true })

      const field = screen
        .getByText('cf.pipeline.flagConfiguration.selectFlag')
        ?.parentElement?.querySelector('input') as HTMLInputElement
      expect(field).toBeDisabled()
    })
  })
})
