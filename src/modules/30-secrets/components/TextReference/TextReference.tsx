import React, { useEffect } from 'react'

import { get, isPlainObject } from 'lodash-es'
import { FormGroup, Intent } from '@blueprintjs/core'
import { FormInput, Layout, Text, Container } from '@wings-software/uicore'
import { FormikContext, connect } from 'formik'
import { useParams } from 'react-router-dom'
import { useStrings } from 'framework/exports'
import { useToaster } from '@common/exports'
import SecretInput from '@secrets/components/SecretInput/SecretInput'

import { getSecretV2Promise } from 'services/cd-ng'
import css from './TextReference.module.scss'

export enum ValueType {
  TEXT = 'TEXT',
  ENCRYPTED = 'ENCRYPTED'
}

export interface TextReferenceInterface {
  value: string
  type: ValueType
}
interface TextReferenceProps {
  name: string
  label?: string
  className?: string
  type?: string
}

interface FormikTextReference extends TextReferenceProps {
  formik: FormikContext<any>
}

const errorCheck = (name: string, formik?: FormikContext<any>) =>
  (get(formik?.touched, name) || (formik?.submitCount && formik?.submitCount > 0)) &&
  get(formik?.errors, name) &&
  !isPlainObject(get(formik?.errors, name))

const TextReference: React.FC<FormikTextReference> = props => {
  const { getString } = useStrings()
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { showError } = useToaster()

  const { formik, name } = props
  const hasError = errorCheck(props.name, formik)

  useEffect(() => {
    if (props.type) {
      formik.setFieldValue('fieldType', props.type)
    } else {
      formik.setFieldValue('fieldType', ValueType.TEXT)
    }
  }, [])

  useEffect(() => {
    if (formik.values.secretField) {
      formik.setFieldValue(props.name, {
        value: formik.values.secretField.referenceString,
        type: ValueType.ENCRYPTED
      })
    }
  }, [formik.values.secretField])

  const getSecretInfo = async (secretString: string) => {
    const scope = secretString.indexOf('.') < 0 ? secretString : secretString.split('.')[1]
    let val
    try {
      const response = await getSecretV2Promise({
        identifier: secretString.indexOf('.') < 0 ? secretString : secretString.split('.')[1],
        queryParams: {
          accountIdentifier: accountId,
          orgIdentifier: scope === 'org' || scope === '' ? orgIdentifier : undefined,
          projectIdentifier: scope === '' ? projectIdentifier : undefined
        }
      })

      val = {
        identifier: secretString.split('.')[1],
        name: response.data?.secret.name || secretString.split('.')[1],
        referenceString: secretString
      }
    } catch (e) {
      showError(e.message)
    }

    return val
  }
  useEffect(() => {
    if (formik.values[props.name]?.type === ValueType.TEXT) {
      formik.setFieldValue('textField', formik.values[props.name].value)
    } else if (formik.values[props.name]?.type === ValueType.ENCRYPTED) {
      getSecretInfo(formik.values[props.name].value).then(data => {
        formik.setFieldValue('secretField', data)
      })
    }
  }, [])
  return (
    <FormGroup helperText={hasError ? get(formik?.errors, name) : null} intent={hasError ? Intent.DANGER : Intent.NONE}>
      <Layout.Vertical className={props.className}>
        <Container className={css.label} height="36px">
          <Text padding={{ top: 'small' }} inline>
            {props.label}
          </Text>
          <FormInput.Select
            name="fieldType"
            items={[
              { label: getString('plaintext'), value: ValueType.TEXT },
              { label: getString('encrypted'), value: ValueType.ENCRYPTED }
            ]}
            disabled={false}
            onChange={() => {
              formik.setFieldValue(props.name, undefined)
              formik.setFieldValue('textField', undefined)
              formik.setFieldValue('secretField', undefined)
            }}
          />
        </Container>
        {formik.values.fieldType === ValueType.TEXT ? (
          <FormInput.Text
            name={'textField'}
            onChange={e => {
              if ((e.target as any).value === '') {
                formik.setFieldValue(props.name, undefined)
              } else {
                formik.setFieldValue(props.name, {
                  value: (e.target as any).value,
                  type: ValueType.TEXT
                })
              }
            }}
            className={css.textCss}
          />
        ) : (
          <SecretInput name={'secretField'} />
        )}
      </Layout.Vertical>
    </FormGroup>
  )
}

export default connect<Omit<FormikTextReference, 'formik'>>(TextReference)
