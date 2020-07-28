import React, { useState } from 'react'
import { Text, SelectOption, Button, Color } from '@wings-software/uikit'
import { Select } from '@blueprintjs/select'
import { FormikProps, connect } from 'formik'
import type { SecretManagerConfigDTO } from 'services/cd-ng'

import EditableText from 'modules/common/components/EditableText/EditableText'
import css from './CreateInlineSecret.module.scss'
import i18n from './CreateInlineSecret.i18n'

export interface InlineSecret {
  secretName: string
  secretId: string
  secretManager?: SelectOption
}

interface CreateInlineSecretProps {
  secretManagers?: SecretManagerConfigDTO[]
  defaultSecretName?: string
  defaultSecretId?: string
  onChange?: (values: InlineSecret) => void
}

const CustomSelect = Select.ofType<SelectOption>()

const CreateInlineSecret: React.FC<CreateInlineSecretProps> = props => {
  const { secretManagers = [], defaultSecretId, defaultSecretName } = props
  const _secretManagers: SelectOption[] = secretManagers.map(sm => {
    return {
      label: sm.identifier || '',
      value: sm.identifier || ''
    }
  })
  const [secretManager, setSecretManager] = useState<SelectOption>()
  const [secretName, setSecretName] = useState(defaultSecretName || '')
  const [secretId, setSecretId] = useState(defaultSecretId || '')

  return (
    <div>
      <Text inline color={Color.GREY_400}>
        {i18n.label1}
      </Text>
      <EditableText
        value={secretName}
        onChange={val => {
          setSecretName(val)
          props.onChange?.({ secretName: val, secretId, secretManager })
        }}
      />
      <span className={css.bullet}>&middot;</span>
      <Text inline color={Color.GREY_400}>
        {i18n.label2}
      </Text>
      <EditableText
        value={secretId}
        onChange={val => {
          setSecretId(val)
          props.onChange?.({ secretName, secretId: val, secretManager })
        }}
      />
      {secretManagers?.length > 0 ? (
        <>
          <span className={css.bullet}>&middot;</span>
          <Text inline color={Color.GREY_400}>
            {i18n.label3}
          </Text>
          <CustomSelect
            items={_secretManagers}
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
              setSecretManager(item)
              props.onChange?.({ secretName, secretId, secretManager: item })
            }}
            popoverProps={{ minimal: true }}
          >
            <Button inline minimal rightIcon="chevron-down" text={secretManager ? secretManager.label : 'Select...'} />
          </CustomSelect>
        </>
      ) : null}
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
