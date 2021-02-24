import React from 'react'
import { render } from '@testing-library/react'
import { Formik, FormikForm } from '@wings-software/uicore'
import { renderHook } from '@testing-library/react-hooks'
import { AppStoreContext as StringsContext } from 'framework/AppStore/AppStoreContext'
import { useStrings } from 'framework/exports'
import { defaultAppStoreTestData } from 'framework/utils/testUtils'
import { NameIdDescriptionTags } from '@common/components'
import type { FormikForNameIdDescriptionTags } from '../NameIdDescriptionTagsConstants'

const wrapper = ({ children }: React.PropsWithChildren<{}>): React.ReactElement => (
  <StringsContext.Provider value={defaultAppStoreTestData}>{children}</StringsContext.Provider>
)
const { result } = renderHook(() => useStrings(), { wrapper })

const onEditInitialValues: FormikForNameIdDescriptionTags = {
  name: 'name-123',
  identifier: 'name123',
  description: 'test description',
  tags: {
    test123: 'abc'
  }
}

function WrapperComponent(props: { initialValues: FormikForNameIdDescriptionTags }): JSX.Element {
  const { initialValues } = props || {}
  return (
    <Formik initialValues={initialValues} onSubmit={() => undefined}>
      {formikProps => (
        <FormikForm>
          <StringsContext.Provider value={defaultAppStoreTestData}>
            <NameIdDescriptionTags formikProps={formikProps} />
          </StringsContext.Provider>
        </FormikForm>
      )}
    </Formik>
  )
}

describe('NameIdDescriptionTags  tests', () => {
  describe('Renders/snapshots', () => {
    test('Initial Render - Name, ID, Description, and Tags', async () => {
      const { container } = render(<WrapperComponent initialValues={{}} />)
      expect(result.current.getString('name')).not.toBeNull()
      expect(container).toMatchSnapshot()
    })

    test('On Edit Render - Name, ID, Description, and Tags', async () => {
      const { container } = render(<WrapperComponent initialValues={onEditInitialValues} />)
      expect(result.current.getString('description')).not.toBeNull()
      expect(result.current.getString('tagsLabel')).not.toBeNull()
      expect(container).toMatchSnapshot()
    })
  })
})
