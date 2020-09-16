import React, { useState, useEffect } from 'react'
import { Text, SelectOption, Button, Color } from '@wings-software/uikit'
import { Select } from '@blueprintjs/select'
import { FormikProps, connect } from 'formik'
import { MenuItem } from '@blueprintjs/core'
import { useGetConnectorList } from 'services/cd-ng'

import EditableText from 'modules/common/components/EditableText/EditableText'
import { Scope } from 'modules/common/interfaces/SecretsInterface'
import i18n from './CreateInlineSecret.i18n'
import css from './CreateInlineSecret.module.scss'

export interface InlineSecret {
  secretName: string
  secretId: string
  secretManager?: SelectOption
  scope: Scope
}

interface CreateInlineSecretProps {
  accountIdentifier: string
  projectIdentifier?: string
  orgIdentifier?: string
  defaultSecretName?: string
  defaultSecretId?: string
  onChange?: (values: InlineSecret) => void
}

const CustomSelect = Select.ofType<SelectOption>()

interface GetScopeParams {
  accountIdentifier?: string
  projectIdentifier?: string
  orgIdentifier?: string
}
const getScope = ({ orgIdentifier, projectIdentifier }: GetScopeParams): Scope => {
  if (orgIdentifier) {
    if (projectIdentifier) {
      return Scope.PROJECT
    }
    return Scope.ORG
  }
  return Scope.ACCOUNT
}

const CreateInlineSecret: React.FC<CreateInlineSecretProps> = props => {
  const { defaultSecretId, defaultSecretName, accountIdentifier, projectIdentifier, orgIdentifier } = props
  const { data: secretManagersApiResponse, error, refetch, loading } = useGetConnectorList({
    accountIdentifier,
    queryParams: { orgIdentifier, projectIdentifier, category: 'SECRET_MANAGER' }
  })
  const scope = getScope({ accountIdentifier, projectIdentifier, orgIdentifier })
  const [secretName, setSecretName] = useState(defaultSecretName || '')
  const [secretId, setSecretId] = useState(defaultSecretId || '')
  const [secretManager, setSecretManager] = useState<SelectOption>()
  const [secretManagers, setSecretManagers] = useState<SelectOption[]>([])
  useEffect(() => {
    const _secretManagers =
      secretManagersApiResponse?.data?.content?.map(sm => {
        return {
          label: sm.name || '',
          value: sm.identifier || ''
        }
      }) || []
    const defaultSecretManagerId = secretManagersApiResponse?.data?.content?.filter(
      sm => sm.connectorDetails?.default
    )[0]?.identifier
    const _defaultSecretManager = _secretManagers.filter(opt => opt.value === defaultSecretManagerId)[0]
    setSecretManagers(_secretManagers)
    setSecretManager(_defaultSecretManager)
  }, [secretManagersApiResponse?.data?.content])

  return (
    <div className={css.container}>
      <Text inline color={Color.GREY_400} font="small">
        {i18n.label1}
      </Text>
      <EditableText
        value={secretName}
        onChange={val => {
          setSecretName(val)
          props.onChange?.({ secretName: val, secretId, secretManager, scope })
        }}
      />
      <span className={css.bullet}>&middot;</span>
      <Text inline color={Color.GREY_400} font="small">
        {i18n.label2}
      </Text>
      <EditableText
        value={secretId}
        onChange={val => {
          setSecretId(val)
          props.onChange?.({ secretName, secretId: val, secretManager, scope })
        }}
      />
      <span className={css.bullet}>&middot;</span>
      <Text inline color={Color.GREY_400} font="small">
        {i18n.label3}
      </Text>{' '}
      {loading ? (
        '...'
      ) : error ? (
        <Button inline minimal text="Retry" onClick={() => refetch()} font="small" />
      ) : (
        <CustomSelect
          items={secretManagers}
          filterable={false}
          itemRenderer={(item, { handleClick }) => (
            <MenuItem key={item.value.toString()} text={item.label} onClick={handleClick} />
          )}
          onItemSelect={item => {
            setSecretManager(item)
            props.onChange?.({ secretName, secretId, secretManager: item, scope })
          }}
          popoverProps={{ minimal: true }}
        >
          <Button
            inline
            minimal
            rightIcon="chevron-down"
            font="small"
            text={secretManager ? secretManager.label : 'Select...'}
          />
        </CustomSelect>
      )}
    </div>
  )
}

interface FormikCreateInlineSecretProps extends CreateInlineSecretProps {
  formik: FormikProps<any>
  name: string
}

const FormikCreateInlineSecretInternal: React.FC<FormikCreateInlineSecretProps> = props => {
  const { formik, name, ...rest } = props
  return (
    <CreateInlineSecret
      {...rest}
      onChange={values => {
        formik.setFieldValue(name, values)
      }}
    />
  )
}

export const FormikCreateInlineSecret = connect<Omit<FormikCreateInlineSecretProps, 'formik'>>(
  FormikCreateInlineSecretInternal
)

export default CreateInlineSecret
