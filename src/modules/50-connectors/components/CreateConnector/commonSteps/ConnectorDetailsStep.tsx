import React, { useRef, useState } from 'react'
import {
  Layout,
  Button,
  Formik,
  StepProps,
  FormInput,
  Text,
  ModalErrorHandlerBinding,
  ModalErrorHandler,
  FormikForm,
  Container
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
import { getHeadingByType } from '../../../pages/connectors/utils/ConnectorHelper'
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
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
  const [isTagsOpen, setIsTagsOpen] = useState(false)
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

      <div>
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
            <FormikForm>
              <Container className={css.connectorForm}>
                <div className={css.connectorFormNameWarpper}>
                  <div className={css.connectorFormNameElm}>
                    <FormInput.InputWithIdentifier inputLabel={i18n.connectorName} />
                  </div>

                  <Layout.Vertical margin="small" padding={{ left: 'large', top: 'small' }} spacing="xsmall">
                    {isDescriptionOpen ? null : (
                      <Text className="link" onClick={() => setIsDescriptionOpen(true)}>
                        {i18n.addDescription}
                      </Text>
                    )}
                    {isTagsOpen ? null : (
                      <Text className="link" onClick={() => setIsTagsOpen(true)}>
                        {i18n.addTags}
                      </Text>
                    )}
                  </Layout.Vertical>
                </div>

                <div className={css.connectorFormElm}>
                  {isDescriptionOpen ? (
                    <>
                      <Container className={css.headerRow}>
                        <Text inline>{i18n.description}</Text>
                        <Text inline className="link" onClick={() => setIsDescriptionOpen(false)}>
                          {i18n.remove}
                        </Text>
                      </Container>

                      <FormInput.TextArea className={css.description} name="description" />
                    </>
                  ) : null}
                </div>
                <div className={css.connectorFormElm}>
                  {isTagsOpen ? (
                    <>
                      <Container className={css.headerRow}>
                        <Text inline>{i18n.tags}</Text>
                        <Text inline className="link" onClick={() => setIsTagsOpen(false)}>
                          {i18n.remove}
                        </Text>
                      </Container>
                      <FormInput.TagInput
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
                    </>
                  ) : null}
                </div>
              </Container>

              <Button type="submit" text={i18n.saveAndContinue} className={css.saveBtn} disabled={loading} />
            </FormikForm>
          )}
        </Formik>
      </div>
    </Layout.Vertical>
  )
}

export default ConnectorDetailsStep
