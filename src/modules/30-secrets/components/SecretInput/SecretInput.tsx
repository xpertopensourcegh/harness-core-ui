import React from 'react'
import { connect, FormikContext } from 'formik'
import { Layout, Icon, Button, Text } from '@wings-software/uikit'

import useCreateOrSelectSecretModal from '@secrets/modals/CreateOrSelectSecretModal/useCreateOrSelectSecretModal'
import type { SecretReference } from '@secrets/components/CreateOrSelectSecret/CreateOrSelectSecret'
import type {
  SecretResponseWrapper,
  ResponsePageConnectorResponse,
  ResponsePageSecretResponseWrapper
} from 'services/cd-ng'
import type { UseGetMockData } from '@common/utils/testUtils'

import i18n from './SecretInput.i18n'
import css from './SecretInput.module.scss'

interface SecretInputProps {
  name: string
  label?: string
  type?: SecretResponseWrapper['secret']['type']
  onSuccess?: (secret: SecretReference) => void
  connectorsListMockData?: UseGetMockData<ResponsePageConnectorResponse>
  secretsListMockData?: ResponsePageSecretResponseWrapper
}

interface FormikSecretInput extends SecretInputProps {
  formik: FormikContext<any>
}

const SecretInput: React.FC<FormikSecretInput> = props => {
  const { formik, label, name, onSuccess, type, connectorsListMockData, secretsListMockData } = props
  const { openCreateOrSelectSecretModal } = useCreateOrSelectSecretModal(
    {
      type,
      onSuccess: secret => {
        formik.setFieldValue(name, secret)
        /* istanbul ignore next */
        onSuccess?.(secret)
      },
      connectorsListMockData,
      secretsListMockData
    },
    [name, onSuccess]
  )
  return (
    <div className={'bp3-form-group'}>
      {label ? <label className={'bp3-label'}>{label}</label> : null}
      <Button
        className={css.inputButton}
        onClick={openCreateOrSelectSecretModal}
        text={
          <Layout.Horizontal width={'100%'} spacing={'xsmall'} style={{ alignItems: 'center' }}>
            <Icon size={24} height={12} name={'key-main'} />
            <span>{formik.values[name] ? formik.values[name]['name'] : i18n.btnLabel}</span>
          </Layout.Horizontal>
        }
      />
      {formik.touched && formik.errors[name] ? <Text intent={'danger'}>{formik.errors[name]}</Text> : null}
    </div>
  )
}

export default connect<Omit<FormikSecretInput, 'formik'>>(SecretInput)
