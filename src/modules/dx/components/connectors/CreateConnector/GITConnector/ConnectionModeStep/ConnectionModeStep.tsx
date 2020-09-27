import React from 'react'
import { Layout, Button, Formik, FormInput, Text, SelectV2, SelectOption } from '@wings-software/uikit'
import * as Yup from 'yup'
import { Form } from 'formik'
import type { GITFormData } from 'modules/dx/interfaces/ConnectorInterface'
import i18n from './ConnectionModeStep.i18n'
import { getHeadingByType } from '../../../../../pages/connectors/utils/ConnectorHelper'
import css from './ConnectionModeStep.module.scss'

// Move this to StepProps
interface ConnectionModeStepProps {
  type: string
  name: string
  connectType: SelectOption
  setConnectType: (type: SelectOption) => void
  setFormData: (formData: GITFormData | undefined) => void
  formData: GITFormData | undefined
  nextStep?: () => void
  previousStep?: (data?: GITFormData | undefined) => void
}
const ConnectionModeStep = (props: ConnectionModeStepProps) => {
  return (
    <Layout.Vertical spacing="xxlarge" className={css.connectionMode}>
      <div className={css.heading}>{getHeadingByType(props.type)}</div>
      <Formik
        initialValues={{
          connectionType: props?.formData?.connectionType || '',
          connectType: props?.formData?.connectType || '',
          url: props?.formData?.url || ''
        }}
        validationSchema={Yup.object().shape({
          connectionType: Yup.string().trim().required(i18n.validation.connectionType),
          url: Yup.string().trim().required(i18n.validation.url)
        })}
        onSubmit={formData => {
          const connectorData = { ...props.formData, ...formData, connectType: props.connectType.value }
          props.setFormData(connectorData)
          props?.nextStep?.()
        }}
      >
        {formikProps => (
          <Form className={css.connectorForm}>
            <div className={css.formFields}>
              <FormInput.RadioGroup
                name="connectionType"
                label={i18n.CONFIGURE_TEXT}
                items={[
                  { label: i18n.gitAccount, value: 'ACCOUNT' },
                  { label: i18n.gitRepo, value: 'REPO' }
                ]}
                className={css.radioGroup}
              />
              <Text className={css.connectByLabel}>{i18n.CONNECT_TEXT}</Text>
              <Layout.Horizontal className={css.connectWrp}>
                <SelectV2
                  items={[
                    { label: i18n.HTTP, value: 'Http' },
                    { label: i18n.SSH, value: 'Ssh' }
                  ]}
                  value={props.connectType}
                  filterable={false}
                  onChange={item => {
                    props.setConnectType(item)
                    formikProps.setFieldValue('connectType', item.value)
                  }}
                  className={css.selectConnectType}
                >
                  <Button text={props.connectType.label} rightIcon="chevron-down" minimal />
                </SelectV2>

                <FormInput.Text
                  name="url"
                  className={css.enterUrl}
                  placeholder={props.connectType.value === 'Ssh' ? i18n.sshPlaceholder : i18n.httpPlaceholder}
                />
              </Layout.Horizontal>
              {props.connectType?.value === 'Ssh' ? (
                <div className={css.sshFields}>
                  <FormInput.Text name="sshKeyRef" label={i18n.SSH_ENCRYPTED_KEY} inputGroup={{ type: 'password' }} />
                  <FormInput.Text name="branchName" label={i18n.BRANCH_NAME} />
                </div>
              ) : null}
            </div>
            <Layout.Horizontal spacing="medium">
              <Button
                onClick={() => props.previousStep?.({ ...props.formData })}
                text={i18n.BACK}
                font={{ size: 'small' }}
              />
              <Button type="submit" text={i18n.continue} className={css.saveBtn} />
            </Layout.Horizontal>
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

export default ConnectionModeStep
