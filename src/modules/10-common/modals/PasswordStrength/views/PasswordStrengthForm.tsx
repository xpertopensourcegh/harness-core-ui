import React from 'react'
import * as yup from 'yup'
import { Layout, Heading, Color, Formik, FormikForm, FormInput, Checkbox, Button } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'

interface Props {
  hideModal: () => void
}

const onSubmit = (): void => {
  // Submit logic
}

const PasswordStrengthForm: React.FC<Props> = ({ hideModal }) => {
  const { getString } = useStrings()

  return (
    <Layout.Vertical padding={{ left: 'huge', right: 'huge' }}>
      <Heading level={1} color={Color.BLACK} font={{ weight: 'bold' }} margin={{ bottom: 'xxlarge' }}>
        {getString('authenticationSettings.passwordStrength')}
      </Heading>
      <Formik
        initialValues={{
          minLength: 8,
          atLeastOneUppercase: true,
          atLeastOneLowercase: true,
          atLeastOneDigit: true,
          atLeastOneSpecialChar: true
        }}
        validationSchema={yup.object().shape({
          minLength: yup.number().required(getString('validation.minLengthRequired'))
        })}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue }) => (
          <FormikForm>
            <FormInput.Text
              name="minLength"
              label={getString('authenticationSettings.minLength')}
              inputGroup={{
                type: 'number'
              }}
            />
            <Layout.Vertical spacing="medium" padding={{ left: 'xxlarge', top: 'xxlarge' }}>
              <Checkbox
                label={getString('authenticationSettings.haveOneUppercase')}
                checked={values.atLeastOneUppercase}
                onChange={e => setFieldValue('atLeastOneUppercase', e.currentTarget.checked)}
              />
              <Checkbox
                label={getString('authenticationSettings.haveOneLowercase')}
                checked={values.atLeastOneLowercase}
                onChange={e => setFieldValue('atLeastOneLowercase', e.currentTarget.checked)}
              />
              <Checkbox
                label={getString('authenticationSettings.haveOneDigit')}
                checked={values.atLeastOneDigit}
                onChange={e => setFieldValue('atLeastOneDigit', e.currentTarget.checked)}
              />
              <Checkbox
                label={getString('authenticationSettings.haveOneSpecialChar')}
                checked={values.atLeastOneSpecialChar}
                onChange={e => setFieldValue('atLeastOneSpecialChar', e.currentTarget.checked)}
              />
            </Layout.Vertical>
            <Layout.Horizontal margin={{ top: 'xxxlarge', bottom: 'xlarge' }}>
              <Button type="submit" intent="primary" margin={{ right: 'xsmall' }}>
                {getString('save')}
              </Button>
              <Button onClick={hideModal}>{getString('cancel')}</Button>
            </Layout.Horizontal>
          </FormikForm>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

export default PasswordStrengthForm
