import React from 'react'
import { connect, FormikContext } from 'formik'
import { Layout, Icon, Button } from '@wings-software/uicore'

import { get, isPlainObject } from 'lodash-es'
import { FormGroup, Intent } from '@blueprintjs/core'
import useCreateOrSelectSecretModal from '@secrets/modals/CreateOrSelectSecretModal/useCreateOrSelectSecretModal'
import type { SecretReference } from '@secrets/components/CreateOrSelectSecret/CreateOrSelectSecret'
import type { SecretResponseWrapper, ResponsePageSecretResponseWrapper } from 'services/cd-ng'

import i18n from './SecretInput.i18n'
import css from './SecretInput.module.scss'

interface SecretInputProps {
  name: string
  label?: string
  type?: SecretResponseWrapper['secret']['type']
  onSuccess?: (secret: SecretReference) => void
  secretsListMockData?: ResponsePageSecretResponseWrapper
}

interface FormikSecretInput extends SecretInputProps {
  formik: FormikContext<any>
}

const SecretInput: React.FC<FormikSecretInput> = props => {
  const { formik, label, name, onSuccess, type = 'SecretText', secretsListMockData } = props
  const { openCreateOrSelectSecretModal } = useCreateOrSelectSecretModal(
    {
      type,
      onSuccess: secret => {
        formik.setFieldValue(name, secret)
        /* istanbul ignore next */
        onSuccess?.(secret)
      },
      secretsListMockData
    },
    [name, onSuccess]
  )
  const errorCheck = (): boolean =>
    ((get(formik?.touched, name) || (formik?.submitCount && formik?.submitCount > 0)) &&
      get(formik?.errors, name) &&
      !isPlainObject(get(formik?.errors, name))) as boolean

  return (
    <FormGroup
      helperText={errorCheck() ? get(formik?.errors, name) : null}
      intent={errorCheck() ? Intent.DANGER : Intent.NONE}
    >
      <Layout.Vertical>
        {label ? <label className={'bp3-label'}>{label}</label> : null}
        <Button
          className={css.inputButton}
          data-testid={name}
          onClick={openCreateOrSelectSecretModal}
          text={
            <Layout.Horizontal width={'100%'} spacing={'xsmall'} style={{ alignItems: 'center' }}>
              <Icon size={24} height={12} name={'key-main'} />
              <span>{formik.values[name] ? formik.values[name]['name'] : i18n.btnLabel}</span>
            </Layout.Horizontal>
          }
        />
      </Layout.Vertical>
    </FormGroup>
  )
}

export default connect<Omit<FormikSecretInput, 'formik'>>(SecretInput)
