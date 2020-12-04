import React, { useState } from 'react'
import {
  Button,
  Formik,
  StepProps,
  FormInput,
  FormikForm as Form,
  ModalErrorHandlerBinding,
  ModalErrorHandler,
  SelectOption,
  Text,
  Container
} from '@wings-software/uikit'
import { useParams } from 'react-router'
import * as Yup from 'yup'

import { StringUtils } from '@common/exports'
import { ConnectorInfoDTO, validateTheIdentifierIsUniquePromise } from 'services/cd-ng'
import type { TagsInterface } from '@common/interfaces/ConnectorsInterface'
import { AddDescriptionAndKVTagsWithIdentifier } from '@common/components/AddDescriptionAndTags/AddDescriptionAndTags'
import type { SecretManagerWizardData } from '../CreateSecretManager'

import i18n from '../CreateSecretManager.i18n'

export interface DetailsData {
  name: string
  identifier: string
  description?: string
  tags?: TagsInterface
  encryptionType: ConnectorInfoDTO['type']
}

const encryptionTypeOptions: SelectOption[] = [
  {
    label: i18n.labelHashicorpVault,
    value: 'Vault'
  }
]

interface ConnectorDetailsStepProps extends StepProps<SecretManagerWizardData> {
  isEditMode?: boolean
  mock?: any
}

const ConnectorDetailsStep: React.FC<ConnectorDetailsStepProps> = props => {
  const { prevStepData, nextStep } = props
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const [loading, setLoading] = useState(false)
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()

  const handleSubmit = async (formData: DetailsData): Promise<void> => {
    setLoading(true)
    modalErrorHandler?.hide()
    try {
      const res = await validateTheIdentifierIsUniquePromise({
        queryParams: {
          accountIdentifier: accountId,
          orgIdentifier: orgIdentifier,
          projectIdentifier: projectIdentifier,
          identifier: formData.identifier
        },
        mock: props.mock
      })
      setLoading(false)
      if (res.data) {
        nextStep?.({ ...prevStepData, detailsData: formData })
      } else {
        modalErrorHandler?.showDanger(i18n.validationUniqueId)
      }
    } catch (error) {
      modalErrorHandler?.showDanger(error)
    }
  }
  return (
    <>
      <Text font={{ size: 'medium' }} padding={{ bottom: 'large', top: 'small' }}>
        {i18n.titleDetails}
      </Text>
      <Container>
        <ModalErrorHandler bind={setModalErrorHandler} style={{ marginBottom: 'var(--spacing-large)' }} />
        <Formik<DetailsData>
          initialValues={{
            name: '',
            encryptionType: 'Vault',
            description: '',
            identifier: '',
            tags: {},
            ...prevStepData?.detailsData
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().trim().required(i18n.validationName),
            identifier: Yup.string().when('name', {
              is: val => val?.length,
              then: Yup.string()
                .trim()
                .required(i18n.validationIdentifier)
                .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, i18n.validIdRegex)
                .notOneOf(StringUtils.illegalIdentifiers)
            }),
            encryptionType: Yup.string().required()
          })}
          onSubmit={formData => {
            handleSubmit(formData)
          }}
        >
          {() => (
            <Form>
              <FormInput.Select
                style={{ width: 450 }}
                name="encryptionType"
                label={i18n.labelEncType}
                items={encryptionTypeOptions}
              />
              <Container style={{ minHeight: 400 }}>
                <AddDescriptionAndKVTagsWithIdentifier
                  identifierProps={{ inputName: 'name', isIdentifierEditable: !props.isEditMode }}
                />
              </Container>
              <Button type="submit" text={i18n.buttonNext} disabled={loading} />
            </Form>
          )}
        </Formik>
      </Container>
    </>
  )
}

export default ConnectorDetailsStep
