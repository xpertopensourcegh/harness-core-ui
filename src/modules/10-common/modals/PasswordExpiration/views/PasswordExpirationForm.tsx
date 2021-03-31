import React from 'react'
import * as yup from 'yup'
import { Layout, Heading, Color, Formik, FormikForm, FormInput, Button } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'

interface Props {
  hideModal: () => void
}

const onSubmit = (): void => {
  // Submit logic
}

const PasswordExpirationForm: React.FC<Props> = ({ hideModal }) => {
  const { getString } = useStrings()

  return (
    <Layout.Vertical padding={{ left: 'huge', right: 'huge' }}>
      <Heading level={1} color={Color.BLACK} font={{ weight: 'bold' }} margin={{ bottom: 'xxlarge' }}>
        {getString('authenticationSettings.passwordExpiration')}
      </Heading>
      <Formik
        initialValues={{
          daysBeforePasswordExpire: 90,
          daysBeforeUserNotified: 5
        }}
        validationSchema={yup.object().shape({
          daysBeforePasswordExpire: yup.number().required(getString('validation.thisIsARequiredField')),
          daysBeforeUserNotified: yup.number().required(getString('validation.thisIsARequiredField'))
        })}
        onSubmit={onSubmit}
      >
        {() => (
          <FormikForm>
            <Layout.Vertical spacing="xlarge">
              <FormInput.Text
                name="daysBeforePasswordExpire"
                label={getString('authenticationSettings.daysBeforePasswordExpires')}
                inputGroup={{
                  type: 'number'
                }}
              />
              <FormInput.Text
                name="daysBeforeUserNotified"
                label={getString('authenticationSettings.daysBeforeUserNotified')}
                inputGroup={{
                  type: 'number'
                }}
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

export default PasswordExpirationForm
