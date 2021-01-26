import React from 'react'
import { render } from '@testing-library/react'
import { Formik, FormikForm } from '@wings-software/uicore'
import { renderHook } from '@testing-library/react-hooks'
import { AppStoreContext as StringsContext, AppStoreContextProps } from 'framework/AppStore/AppStoreContext'
import { useStrings } from 'framework/exports'
import strings from 'strings/strings.en.yaml'
import type { FormikForNameIdDescriptionTags } from '../NameIdDescriptionTagsConstants'
import { NameIdDescriptionTags } from '../NameIdDescriptionTags'

const value: AppStoreContextProps = {
  strings,
  featureFlags: {},
  updateAppStore: jest.fn()
}

const wrapper = ({ children }: React.PropsWithChildren<{}>): React.ReactElement => (
  <StringsContext.Provider value={value}>{children}</StringsContext.Provider>
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
          <StringsContext.Provider value={value}>
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
