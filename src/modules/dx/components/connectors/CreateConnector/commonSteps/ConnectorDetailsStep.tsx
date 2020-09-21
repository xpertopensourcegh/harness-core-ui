import React, { useEffect, useRef, useState } from 'react'
import {
  Layout,
  Button,
  Formik,
  StepProps,
  FormInput,
  FormikForm as Form,
  ModalErrorHandlerBinding,
  ModalErrorHandler
} from '@wings-software/uikit'
import { useParams } from 'react-router'
import * as Yup from 'yup'
import { StringUtils } from 'modules/common/exports'
import { useValidateTheIdentifierIsUnique, ConnectorConfigDTO } from 'services/cd-ng'
import { getHeadingByType, getConnectorTextByType } from '../../../../pages/connectors/utils/ConnectorHelper'
import i18n from './ConnectorDetailsStep.i18n'
import css from './ConnectorDetailsStep.module.scss'

interface ConnectorDetailsStepProps extends StepProps<ConnectorConfigDTO> {
  type: ConnectorConfigDTO['type']
  name: string
  setFormData?: (formData: ConnectorConfigDTO) => void
  formData?: ConnectorConfigDTO
}

const ConnectorDetailsStep: React.FC<StepProps<ConnectorConfigDTO> & ConnectorDetailsStepProps> = props => {
  const { prevStepData, nextStep } = props
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const [stepData, setStepData] = useState<ConnectorConfigDTO>(prevStepData || props.formData || {})
  const { loading, data, refetch: validateUniqueIdentifier, error } = useValidateTheIdentifierIsUnique({
    accountIdentifier: accountId,
    lazy: true,
    queryParams: { orgIdentifier: orgIdentifier, projectIdentifier: projectIdentifier }
  })
  const mounted = useRef(false)
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  useEffect(() => {
    if (mounted.current && !loading) {
      if (data?.data) {
        nextStep?.({ ...prevStepData, ...stepData })
      } else {
        if (error) {
          modalErrorHandler?.showDanger(error.message)
        } else {
          modalErrorHandler?.showDanger(i18n.validateError)
        }
      }
    } else {
      mounted.current = true
    }
  }, [mounted, loading, data])
  return (
    <Layout.Vertical spacing="xxlarge" className={css.firstep}>
      <div className={css.heading}>{getHeadingByType(props.type)}</div>
      <ModalErrorHandler bind={setModalErrorHandler} />
      <Formik
        initialValues={{
          name: '',
          description: '',
          identifier: '',
          tags: [],
          ...prevStepData,
          ...props.formData
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().required(i18n.validation.name),
          identifier: Yup.string().when('name', {
            is: val => val?.length,
            then: Yup.string()
              .trim()
              .required(i18n.validation.identifier)
              .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, i18n.validIdRegex)
              .notOneOf(StringUtils.illegalIdentifiers)
          })
        })}
        onSubmit={formData => {
          setStepData(formData)
          validateUniqueIdentifier({ queryParams: { connectorIdentifier: formData.identifier } })
          props.setFormData?.(formData)
        }}
      >
        {() => (
          <Form>
            <div className={css.connectorForm}>
              <FormInput.InputWithIdentifier inputLabel={`Give your ${getConnectorTextByType(props.type)} a name `} />
              <FormInput.TextArea className={css.description} label={i18n.description} name="description" />
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
