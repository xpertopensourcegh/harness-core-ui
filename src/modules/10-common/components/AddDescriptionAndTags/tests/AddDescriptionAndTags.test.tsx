import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { Formik, FormikForm } from '@wings-software/uikit'
import { DescriptionAndTagsWithIdentifier } from '../AddDescriptionAndTags'
import i18n from '../AddDescriptionAndTags.i18n'

function WrapperComponent(): JSX.Element {
  return (
    <Formik initialValues={{}} onSubmit={() => undefined}>
      <FormikForm>
        <DescriptionAndTagsWithIdentifier identifierProps={{ inputLabel: 'name' }} />
      </FormikForm>
    </Formik>
  )
}

describe('Unit tests for AddDescriptionTags Component', () => {
  test('Ensure description and tag fields open and close', async () => {
    const { container, getByText, getAllByText } = render(<WrapperComponent />)
    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())

    expect(container.querySelector('[class*="expandedDescription"]')).toBeNull()
    expect(container.querySelector('[class*="expandedTags"]')).toBeNull()

    const descriptionButton = getByText(i18n.addDescriptionLabel)
    fireEvent.click(descriptionButton)
    await waitFor(() => expect(container.querySelector('[class*="expandedDescription"]')).not.toBeNull())

    const tagsButton = getByText(i18n.addTagsLabel)
    fireEvent.click(tagsButton)
    await waitFor(() => expect(container.querySelector('[class*="expandedTags"]')).not.toBeNull())

    const hideButtons = getAllByText(i18n.hideInput)
    expect(hideButtons.length).toBe(2)

    fireEvent.click(hideButtons[0])
    await waitFor(() => expect(container.querySelector('[class*="expandedDescription"]')).toBeNull())

    fireEvent.click(hideButtons[1])
    await waitFor(() => expect(container.querySelector('[class*="expandedTags"]')).toBeNull())
  })
})
