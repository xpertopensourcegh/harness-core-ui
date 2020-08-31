import React, { useEffect, useRef, useState } from 'react'
import { Layout, Button, Formik, StepProps, FormInput } from '@wings-software/uikit'
import * as Yup from 'yup'
import { Form } from 'formik'
import { StringUtils, useToaster } from 'modules/common/exports'
import { useValidateTheIdentifierIsUnique, ConnectorConfigDTO } from 'services/cd-ng'
import type { KubFormData, GITFormData } from 'modules/dx/interfaces/ConnectorInterface'
import { getHeadingByType, getConnectorTextByType } from '../../../../pages/connectors/utils/ConnectorHelper'
import i18n from './ConnectorDetailsStep.i18n'
import css from './ConnectorDetailsStep.module.scss'

interface ConnectorDetailsStepProps extends StepProps<unknown> {
  accountId: string
  projectIdentifier?: string
  orgIdentifier?: string
  type: ConnectorConfigDTO['type']
  name: string
  setFormData: (formData: KubFormData | GITFormData | undefined) => void
  formData: KubFormData | GITFormData | undefined
}

const ConnectorDetailsStep: React.FC<ConnectorDetailsStepProps> = props => {
  const { showError } = useToaster()
  const [stepData, setStepData] = useState(props.formData)
  const { loading, data, refetch: validateUniqueIdentifier } = useValidateTheIdentifierIsUnique({
    accountIdentifier: props.accountId,
    lazy: true,
    queryParams: { orgIdentifier: props.orgIdentifier, projectIdentifier: props.projectIdentifier }
  })
  const mounted = useRef(false)
  useEffect(() => {
    if (mounted.current && !loading) {
      if (data?.data) {
        props.nextStep?.(stepData)
      } else {
        showError(i18n.validateError)
      }
    } else {
      mounted.current = true
    }
  }, [mounted, loading, data])
  return (
    <Layout.Vertical spacing="xxlarge" className={css.firstep}>
      <div className={css.heading}>{getHeadingByType(props.type)}</div>
      <Formik
        initialValues={{
          name: props.formData?.name || '',
          description: props.formData?.description || '',
          identifier: props.formData?.identifier || '',
          tags: props.formData?.tags || []
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().required(),
          identifier: Yup.string()
            .trim()
            .required()
            .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, 'Identifier can only contain alphanumerics, _ and $')
            .notOneOf(StringUtils.illegalIdentifiers),
          description: Yup.string()
        })}
        onSubmit={formData => {
          setStepData(formData)
          validateUniqueIdentifier({ queryParams: { connectorIdentifier: formData.identifier } })
          props.setFormData(formData)
        }}
      >
        {() => (
          <Form>
            <div className={css.connectorForm}>
              <FormInput.InputWithIdentifier inputLabel={`Give your ${getConnectorTextByType(props.type)} a name `} />
              <FormInput.TextArea label={i18n.description} name="description" />
              <FormInput.TagInput
                label={i18n.tags}
                name="tags"
                labelFor={name => (typeof name === 'string' ? name : '')}
                itemFromNewTag={newTag => newTag}
                items={[]}
                className={css.tags}
                tagInputProps={{
                  noInputBorder: true,
                  openOnKeyDown: false,
                  showAddTagButton: true,
                  showClearAllButton: true,
                  allowNewTag: true
                }}
              />
            </div>
            <Button type="submit" text={i18n.saveAndContinue} className={css.saveBtn} disabled={loading} />
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

export default ConnectorDetailsStep
