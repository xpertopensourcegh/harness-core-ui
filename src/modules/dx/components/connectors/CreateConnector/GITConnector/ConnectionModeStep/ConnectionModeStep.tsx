import React, { useState } from 'react'
import { Layout, Button, Formik, FormInput, Text, SelectOption } from '@wings-software/uikit'
import * as Yup from 'yup'
import { getHeadingByType } from '../../../../../pages/connectors/utils/ConnectorHelper'
import css from './ConnectionModeStep.module.scss'
import i18n from './ConnectionModeStep.i18n'
import { Form } from 'formik'
import { Select } from '@blueprintjs/select'
import type { GITFormData } from 'modules/dx/interfaces/ConnectorInterface'

interface ConnectionModeStepProps {
  type: string
  name: string
  setConnectType: (type: any) => void
  setFormData: (formData: GITFormData | undefined) => void
  formData: GITFormData | undefined
  nextStep?: () => void
}
const CustomSelect = Select.ofType<SelectOption>()
const ConnectionModeStep = (props: ConnectionModeStepProps) => {
  const [connectBy, setConnectBy] = useState({ label: 'HTTP', value: 'Http' } as SelectOption)

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
          connectionType: Yup.string().trim().required(),
          connectType: Yup.string().trim().required(),
          url: Yup.string().trim().required()
        })}
        onSubmit={formData => {
          props.setFormData(formData)
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
                  { label: i18n.gitAccount, value: 'Account' },
                  { label: i18n.gitRepo, value: 'Repo' }
                ]}
                className={css.radioGroup}
              />
              <Text className={css.connectByLabel}>{i18n.CONNECT_TEXT}</Text>
              <Layout.Horizontal className={css.connectWrp}>
                <CustomSelect
                  items={[
                    { label: i18n.HTTP, value: 'Http' },
                    { label: i18n.SSH, value: 'Ssh' }
                  ]}
                  filterable={false}
                  itemRenderer={(item, { handleClick }) => (
                    <Button
                      inline
                      minimal
                      text={item.label}
                      onClick={e => handleClick(e as React.MouseEvent<HTMLElement, MouseEvent>)}
                    />
                  )}
                  onItemSelect={item => {
                    setConnectBy(item)
                    props.setConnectType(item)
                  }}
                  popoverProps={{ minimal: true, className: css.selectPopover }}
                  className={css.selectConnectType}
                >
                  <Button
                    inline
                    minimal
                    rightIcon="chevron-down"
                    text={connectBy ? connectBy.label : 'Select...'}
                    className={css.connectByBtn}
                  />
                </CustomSelect>

                <FormInput.Text name="url" className={css.enterUrl} />
              </Layout.Horizontal>
              {connectBy?.value === 'Ssh' ? (
                <div className={css.sshFields}>
                  <FormInput.Text
                    name="sshKeyReference"
                    label={i18n.SSH_ENCRYPTED_KEY}
                    inputGroup={{ type: 'password' }}
                  />
                  <FormInput.Text name="branchName" label={i18n.BRANCH_NAME} />
                </div>
              ) : null}
            </div>
            <Button
              type="submit"
              text={i18n.continue}
              className={css.saveBtn}
              onClick={() => {
                const formData = { ...props.formData, ...formikProps.values, connectType: connectBy?.value }
                props.setFormData(formData)
                props?.nextStep?.()
              }}
            />
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

export default ConnectionModeStep
