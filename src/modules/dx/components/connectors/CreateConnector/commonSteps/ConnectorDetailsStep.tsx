import React from 'react'
import { Layout, Button, Formik } from '@wings-software/uikit'
import * as Yup from 'yup'
import { illegalIdentifiers } from 'framework/utils/StringUtils'
import { getHeadingByType } from '../../../../pages/connectors/utils/ConnectorHelper'
import ConnectorDetailFields from 'modules/dx/pages/connectors/Forms/ConnectorDetailFields'
import { Form } from 'formik'
import i18n from './ConnectorDetailsStep.i18n'
import css from './ConnectorDetailsStep.module.scss'
import type { KubFormData } from 'modules/dx/interfaces/ConnectorInterface'

interface ConnectorDetailsStepProps {
  name: string
  setFormData: (formData: KubFormData | undefined) => void
  formData: KubFormData | undefined
  // adding any As the type is StepProps and not able to use it here somehow... will add as I find a solution
  nextStep?: (data?: any) => void
}

const ConnectorDetailsStep = (props: ConnectorDetailsStepProps) => {
  return (
    <Layout.Vertical spacing="xxlarge" className={css.firstep}>
      <div className={css.heading}>{getHeadingByType('K8sCluster')}</div>
      <Formik
        initialValues={{
          name: props?.formData?.name || '',
          description: props?.formData?.description || '',
          identifier: props?.formData?.identifier || '',
          tags: props?.formData?.tags || []
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().required(),
          identifier: Yup.string()
            .trim()
            .required()
            .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, 'Identifier can only contain alphanumerics, _ and $')
            .notOneOf(illegalIdentifiers),
          description: Yup.string()
        })}
        onSubmit={formData => {
          props?.nextStep?.({})
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
