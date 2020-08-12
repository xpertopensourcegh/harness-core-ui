import React, { useEffect, useRef, useState } from 'react'
import { Layout, Button, Formik, StepProps } from '@wings-software/uikit'
import * as Yup from 'yup'
import { Form } from 'formik'
import { StringUtils, useToaster } from 'modules/common/exports'
import ConnectorDetailFields from 'modules/dx/pages/connectors/Forms/ConnectorDetailFields'
import { useValidateTheIdentifierIsUnique } from 'services/cd-ng'
import type { KubFormData, GITFormData } from 'modules/dx/interfaces/ConnectorInterface'
import { getHeadingByType } from '../../../../pages/connectors/utils/ConnectorHelper'
import i18n from './ConnectorDetailsStep.i18n'
import css from './ConnectorDetailsStep.module.scss'

interface ConnectorDetailsStepProps extends StepProps<unknown> {
  accountId: string
  type: string
  name: string
  setFormData: (formData: KubFormData | GITFormData | undefined) => void
  formData: KubFormData | GITFormData | undefined
}

const ConnectorDetailsStep: React.FC<ConnectorDetailsStepProps> = props => {
  const { showError } = useToaster()
  const [stepData, setStepData] = useState(props.formData)
  const { loading, data, refetch: revalidateUniqueIdentifier } = useValidateTheIdentifierIsUnique({
    accountIdentifier: props.accountId,
    lazy: true
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
          revalidateUniqueIdentifier({ queryParams: { connectorIdentifier: formData.identifier } })
          props.setFormData(formData)
        }}
      >
        {() => (
          <Form className={css.connectorForm}>
            <ConnectorDetailFields />
            <Button type="submit" text={i18n.saveAndContinue} className={css.saveBtn} />
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

export default ConnectorDetailsStep
