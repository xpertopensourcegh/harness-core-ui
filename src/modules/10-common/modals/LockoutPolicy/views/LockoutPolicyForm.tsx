import React from 'react'
import * as yup from 'yup'
import {
  Layout,
  Heading,
  Color,
  Formik,
  FormikForm,
  FormInput,
  Checkbox,
  Button,
  Select,
  Text
} from '@wings-software/uicore'
import { useStrings } from 'framework/exports'

interface Props {
  hideModal: () => void
}

const onSubmit = (): void => {
  // Submit logic
}

const options = [
  {
    label: 'Group 1',
    value: 'G1'
  },
  {
    label: 'Group 2',
    value: 'G2'
  }
]

const LockoutPolicyForm: React.FC<Props> = ({ hideModal }) => {
  const { getString } = useStrings()

  return (
    <Layout.Vertical padding={{ left: 'huge', right: 'huge' }}>
      <Heading level={1} color={Color.BLACK} font={{ weight: 'bold' }} margin={{ bottom: 'xxlarge' }}>
        {getString('authenticationSettings.lockoutPolicy')}
      </Heading>
      <Formik
        initialValues={{
          failedLogins: 5,
          lockoutDuration: 24,
          notifyUser: false
        }}
        validationSchema={yup.object().shape({
          failedLogins: yup.number().required(getString('validation.thisIsARequiredField')),
          lockoutDuration: yup.number().required(getString('validation.thisIsARequiredField'))
        })}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue }) => (
          <FormikForm>
            <Layout.Vertical spacing="xlarge">
              <FormInput.Text
                name="failedLogins"
                label={getString('authenticationSettings.failedLoginsBeforeLocked')}
                inputGroup={{
                  type: 'number'
                }}
              />
              <FormInput.Text
                name="lockoutDuration"
                label={getString('authenticationSettings.lockoutDuration')}
                inputGroup={{
                  type: 'number'
                }}
              />
            </Layout.Vertical>
            <Layout.Vertical padding={{ left: 'xxlarge', top: 'large', bottom: 'xxlarge' }}>
              <Checkbox
                label={getString('authenticationSettings.notifyUsersWhenTheyLocked')}
                checked={values.notifyUser}
                onChange={e => setFieldValue('notifyUser', e.currentTarget.checked)}
              />
            </Layout.Vertical>
            <Text color={Color.GREY_500} padding={{ top: 'xsmall', bottom: 'xsmall' }}>
              {getString('authenticationSettings.notifyUsersWHenUserLocked')}
            </Text>
            <Select items={options} inputProps={{ placeholder: getString('authenticationSettings.selectUserGroup') }} />
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

export default LockoutPolicyForm
