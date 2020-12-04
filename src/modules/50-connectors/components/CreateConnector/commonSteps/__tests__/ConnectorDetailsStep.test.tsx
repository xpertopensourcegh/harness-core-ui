import React from 'react'
import { MemoryRouter } from 'react-router'
import { render, queryByText, fireEvent } from '@testing-library/react'
import { clickSubmit, InputTypes, setFieldValue } from '@common/utils/JestFormHelper'
import i18n from '@common/components/AddDescriptionAndTags/AddDescriptionAndTags.i18n'
import ConnectorDetailsStep from '../ConnectorDetailsStep'

describe('Connector details step', () => {
  test('render for create kubernetes connector step one', async () => {
    const desciptiion = 'dummy description'
    const { container, getByText } = render(
      <MemoryRouter>
        <ConnectorDetailsStep name="sample-name" type="K8sCluster" />
      </MemoryRouter>
    )
    expect(queryByText(container, 'Name')).not.toBeNull()
    fireEvent.click(getByText(i18n.addDescriptionLabel))
    setFieldValue({
      type: InputTypes.TEXTAREA,
      container: container,
      fieldId: 'description',
      value: desciptiion
    })
    // test for retaining values on toggling form feilds
    fireEvent.click(getByText(i18n.hideInput)) //hiding description
    expect(container).toMatchSnapshot() // matching snapshot with description and tags hidden
    fireEvent.click(getByText(i18n.addDescriptionLabel)) //showing description
    fireEvent.click(getByText(i18n.addTagsLabel)) //showing tags
    expect(queryByText(container, desciptiion)).not.toBeNull()
    expect(container).toMatchSnapshot()
    clickSubmit(container)
  })
})
