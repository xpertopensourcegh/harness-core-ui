import React, { useRef, useState } from 'react'
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
import { StringUtils } from '@common/exports'
import {
  ConnectorConfigDTO,
  ConnectorInfoDTO,
  ResponseBoolean,
  validateTheIdentifierIsUniquePromise,
  Failure
} from 'services/cd-ng'
import { getHeadingByType, getConnectorTextByType } from '../../../pages/connectors/utils/ConnectorHelper'
import i18n from './ConnectorDetailsStep.i18n'
import css from './ConnectorDetailsStep.module.scss'

interface ConnectorDetailsStepProps extends StepProps<ConnectorInfoDTO> {
  type: ConnectorInfoDTO['type']
  name: string
  setFormData?: (formData: ConnectorConfigDTO) => void
  formData?: ConnectorConfigDTO
  mock?: ResponseBoolean
}

const ConnectorDetailsStep: React.FC<StepProps<ConnectorConfigDTO> & ConnectorDetailsStepProps> = props => {
  const { prevStepData, nextStep } = props
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const mounted = useRef(false)
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: ConnectorConfigDTO): Promise<void> => {
    mounted.current = true
    setLoading(true)

    try {
      const response = await validateTheIdentifierIsUniquePromise({
        queryParams: {
          identifier: formData.identifier,
          accountIdentifier: accountId,
          orgIdentifier: orgIdentifier,
          projectIdentifier: projectIdentifier
        },
        mock: props.mock
      })
      setLoading(false)

      if ('SUCCESS' === response.status) {
        if (response.data) {
          props.setFormData?.(formData)
          nextStep?.({ ...prevStepData, ...formData })
        } else {
          modalErrorHandler?.showDanger(i18n.validateError)
        }
      } else {
        throw response as Failure
      }
    } catch (error) {
      setLoading(false)
      modalErrorHandler?.showDanger(error.message)
    }
  }

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
          handleSubmit(formData)
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
