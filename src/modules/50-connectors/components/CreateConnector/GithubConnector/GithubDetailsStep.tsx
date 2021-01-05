import React, { useRef, useState } from 'react'
import {
  Layout,
  Button,
  Formik,
  StepProps,
  ModalErrorHandlerBinding,
  ModalErrorHandler,
  FormikForm,
  Container,
  FormInput,
  Text
} from '@wings-software/uicore'
import { useParams } from 'react-router'
import * as Yup from 'yup'
import { pick } from 'lodash-es'
import type { IOptionProps } from '@blueprintjs/core'
import type { FormikProps } from 'formik'
import { StringUtils } from '@common/exports'
import {
  ConnectorConfigDTO,
  ConnectorInfoDTO,
  ResponseBoolean,
  validateTheIdentifierIsUniquePromise,
  Failure
} from 'services/cd-ng'
import { AddDescriptionAndKVTagsWithIdentifier } from '@common/components/AddDescriptionAndTags/AddDescriptionAndTags'
import { String, useStrings } from 'framework/exports'
import { GitUrlType, GitConnectionType } from '@connectors/pages/connectors/utils/ConnectorUtils'
import { getHeadingByType } from '../../../pages/connectors/utils/ConnectorHelper'
import css from './ConnectorDetailsStep.module.scss'
export type DetailsForm = Pick<ConnectorInfoDTO, 'name' | 'identifier' | 'description' | 'tags'>

interface ConnectorDetailsStepProps extends StepProps<ConnectorInfoDTO> {
  type: ConnectorInfoDTO['type']
  name: string
  setFormData?: (formData: ConnectorConfigDTO) => void
  formData?: ConnectorConfigDTO
  isEditMode?: boolean
  connectorInfo: ConnectorInfoDTO | void
  mock?: ResponseBoolean
}

interface DetailsStepInterface {
  name: string
  description?: string
  identifier: string
  tags?: Record<string, string>
  urlType: string
  connectionType: string
  url: string
}

const GithubDetailsStep: React.FC<StepProps<ConnectorConfigDTO> & ConnectorDetailsStepProps> = props => {
  const { prevStepData, nextStep } = props
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const mounted = useRef(false)
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const [, setLoading] = useState(false)
  const isEdit = props.isEditMode || prevStepData?.isEdit
  const { getString } = useStrings()

  const urlTypeOptions: IOptionProps[] = [
    {
      label: getString('account'),
      value: GitUrlType.ACCOUNT
    },
    {
      label: getString('repository'),
      value: GitUrlType.REPO
    }
  ]

  const connectionTypeOptions: IOptionProps[] = [
    {
      label: getString('HTTPS'),
      value: GitConnectionType.HTTPS
    },
    {
      label: getString('SSH'),
      value: GitConnectionType.SSH
    }
  ]

  const handleSubmit = async (formData: ConnectorConfigDTO): Promise<void> => {
    mounted.current = true
    if (isEdit) {
      //In edit mode validateTheIdentifierIsUnique API not required
      props.setFormData?.(formData)
      nextStep?.({ ...props.connectorInfo, ...prevStepData, ...formData })
    } else {
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
            nextStep?.({ ...props.connectorInfo, ...prevStepData, ...formData })
          } else {
            modalErrorHandler?.showDanger(getString('validation.duplicateIdError'))
          }
        } else {
          throw response as Failure
        }
      } catch (error) {
        setLoading(false)
        modalErrorHandler?.showDanger(error.message)
      }
    }
  }

  const getInitialValues = (): DetailsStepInterface => {
    if (isEdit && props.connectorInfo) {
      return {
        ...pick(props.connectorInfo, ['name', 'identifier', 'description', 'tags']),
        urlType: props.connectorInfo?.spec?.type,
        connectionType: props.connectorInfo?.spec.authentication.type,
        url: props.connectorInfo?.spec.url
      }
    } else {
      return {
        name: '',
        description: '',
        identifier: '',
        tags: {},
        urlType: GitUrlType.ACCOUNT,
        connectionType: GitConnectionType.HTTPS,
        url: ''
      }
    }
  }

  return (
    <Layout.Vertical spacing="xxlarge" className={css.firstep}>
      <div className={css.heading}>{getHeadingByType(props.type)}</div>
      <ModalErrorHandler bind={setModalErrorHandler} />

      <Container padding="small" className={css.connectorForm}>
        <Formik<DetailsForm>
          onSubmit={formData => {
            handleSubmit(formData)
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().trim().required(getString('validation.nameRequired')),
            url: Yup.string().trim().required(getString('validation.UrlRequired')),
            identifier: Yup.string().when('name', {
              is: val => val?.length,
              then: Yup.string()
                .trim()
                .required(getString('validation.identifierRequired'))
                .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, getString('validation.validIdRegex'))
                .notOneOf(StringUtils.illegalIdentifiers)
            })
          })}
          initialValues={{
            ...(getInitialValues() as DetailsForm),
            ...prevStepData,
            ...props.formData
          }}
        >
          {(formikProps: FormikProps<DetailsStepInterface>) => {
            return (
              <FormikForm>
                <Container style={{ minHeight: 460 }}>
                  <AddDescriptionAndKVTagsWithIdentifier
                    formikProps={formikProps}
                    identifierProps={{ inputName: 'name', isIdentifierEditable: !isEdit }}
                  />
                  <Text>{getString('connectors.git.urlType')}</Text>
                  <FormInput.RadioGroup
                    style={{ fontSize: 'normal' }}
                    name="urlType"
                    radioGroup={{ inline: true }}
                    items={urlTypeOptions}
                  />
                  <Text>{getString('connectors.git.connectionType')}</Text>
                  <FormInput.RadioGroup
                    style={{ fontSize: 'normal' }}
                    name="connectionType"
                    radioGroup={{ inline: true }}
                    items={connectionTypeOptions}
                  />
                  <FormInput.Text
                    className={css.formElm}
                    name="url"
                    label={
                      formikProps.values.urlType === GitUrlType.ACCOUNT
                        ? getString('connectors.git.gitHubAccountUrl')
                        : getString('connectors.git.gitHubRepoUrl')
                    }
                    placeholder={
                      formikProps.values.connectionType === GitConnectionType.HTTPS
                        ? getString('connectors.git.gitHubUrlPlaceholder')
                        : getString('connectors.git.gitHubUrlPlaceholderSSH')
                    }
                  />
                </Container>
                <Layout.Horizontal>
                  <Button type="submit" intent="primary">
                    <String stringID="saveAndContinue" />
                  </Button>
                </Layout.Horizontal>
              </FormikForm>
            )
          }}
        </Formik>
      </Container>
    </Layout.Vertical>
  )
}

export default GithubDetailsStep
