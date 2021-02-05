import React, { useState } from 'react'
import { useParams } from 'react-router'
import * as Yup from 'yup'
import {
  Layout,
  Button,
  StepProps,
  Heading,
  Formik,
  FormikForm,
  Container,
  Text,
  ModalErrorHandler,
  ModalErrorHandlerBinding
} from '@wings-software/uicore'
import type { ConnectorInfoDTO, ConnectorConfigDTO } from 'services/cd-ng'
import { validateTheIdentifierIsUniquePromise, Failure } from 'services/cd-ng'
import { StringUtils } from '@common/exports'
import { AddDescriptionAndKVTagsWithIdentifier } from '@common/components/AddDescriptionAndTags/AddDescriptionAndTags'
import PermissionCard from '../../../PermissionCard/PermissionCard'
import type { permission as PermissionType } from '../constants'
import { CO_PERMISSION, CE_PERMISSION, COCE_PERMISSION } from '../constants'
import i18n from '../AWSCOConnector.i18n'
import css from './Steps.module.scss'

interface OverviewDetails {
  name: string
  identifier: string
  description: string
  tags: {}
  billingPermission?: boolean
  eventsPermission?: boolean
  optimizationPermission?: boolean
}

export type OverviewForm = Pick<
  OverviewDetails,
  'name' | 'identifier' | 'description' | 'tags' | 'billingPermission' | 'eventsPermission' | 'optimizationPermission'
>

interface OverviewStepProps extends StepProps<ConnectorInfoDTO> {
  type: ConnectorInfoDTO['type']
  name: string
  permission: PermissionType
}

const OverviewStep: React.FC<StepProps<ConnectorConfigDTO> & OverviewStepProps> = props => {
  const { nextStep, permission } = props
  const cePermission = permission === CE_PERMISSION || permission === COCE_PERMISSION
  const coPermission = permission === CO_PERMISSION || permission === COCE_PERMISSION
  const [billing, setBilling] = useState(cePermission)
  const [events, setEvents] = useState(cePermission)
  const [optimization, setOptimization] = useState(coPermission)
  const toggleBilling = (): void => setBilling(!billing)
  const toggleEvents = (): void => setEvents(!events)
  const [loading, setLoading] = useState(false)
  const toggleOptimization = (): void => setOptimization(!optimization)
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const { accountId, projectIdentifier, orgIdentifier } = useParams<{
    accountId: string
    projectIdentifier: string
    orgIdentifier: string
  }>()
  const randomString = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }
  const handleSubmit = async (values: OverviewDetails): Promise<void> => {
    setLoading(true)
    try {
      modalErrorHandler?.hide()
      const response = await validateTheIdentifierIsUniquePromise({
        queryParams: {
          identifier: values.identifier,
          accountIdentifier: accountId,
          orgIdentifier: orgIdentifier,
          projectIdentifier: projectIdentifier
        }
      })
      setLoading(false)

      if ('SUCCESS' === response.status) {
        if (response.data) {
          const spec: ConnectorConfigDTO = {
            billingPermission: values.billingPermission,
            eventsPermission: values.eventsPermission,
            optimizationPermission: values.optimizationPermission,
            roleARN: '',
            externalID: randomString()
          }
          const connectorDetails: ConnectorInfoDTO = {
            name: values.name,
            identifier: values.identifier,
            description: values.description,
            // orgIdentifier: orgIdentifier,
            projectIdentifier: '',
            tags: values.tags,
            type: 'CEAws',
            spec: spec
          }
          nextStep?.(connectorDetails)
        } else {
          modalErrorHandler?.showDanger('ID uniqueness check failed')
        }
      } else {
        throw response as Failure
      }
    } catch (error) {
      setLoading(false)
      modalErrorHandler?.showDanger(error.data?.message || error.message)
    }
  }
  return (
    <Layout.Vertical data-id={'todo'} spacing="large" className={css.containerLayout}>
      <Container padding="medium">
        <Heading level={2} font={{ weight: 'bold' }}>
          {i18n.overview.title}
        </Heading>
        <Formik<OverviewForm>
          initialValues={{
            name: '',
            description: '',
            identifier: '',
            tags: {},
            billingPermission: cePermission,
            eventsPermission: cePermission,
            optimizationPermission: coPermission
          }}
          onSubmit={values => {
            handleSubmit(values)
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().trim().required(i18n.overview.validation.name),
            identifier: Yup.string().when('name', {
              is: val => val?.length,
              then: Yup.string()
                .trim()
                .required(i18n.overview.validation.identifier.required)
                .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, i18n.overview.validation.identifier.format)
                .notOneOf(StringUtils.illegalIdentifiers)
            })
          })}
        >
          {formikProps => {
            return (
              <FormikForm>
                <ModalErrorHandler bind={setModalErrorHandler} />
                <Container padding={{ top: 'large', bottom: 'large' }}>
                  <AddDescriptionAndKVTagsWithIdentifier
                    formikProps={formikProps}
                    identifierProps={{ inputName: 'name', inputLabel: i18n.overview.label }}
                  />
                </Container>
                <Layout.Vertical spacing="large" padding={{ bottom: 'large' }}>
                  <Text font={{ weight: 'light' }}>{i18n.overview.featureSelection}</Text>
                  <Layout.Horizontal spacing="large">
                    <PermissionCard
                      preTitle={i18n.cost}
                      title={i18n.visibility.title}
                      description={i18n.visibility.description}
                      enabled={billing}
                      onSelect={toggleBilling}
                    />
                    <PermissionCard
                      preTitle={i18n.cost}
                      title={i18n.event.title}
                      description={i18n.event.description}
                      enabled={events}
                      onSelect={toggleEvents}
                    />
                    <PermissionCard
                      preTitle={i18n.cost}
                      title={i18n.optimization.title}
                      description={i18n.optimization.description}
                      enabled={optimization}
                      onSelect={toggleOptimization}
                    />
                  </Layout.Horizontal>
                </Layout.Vertical>
                <Button
                  intent="primary"
                  type="submit"
                  text={i18n.overview.submitText}
                  rightIcon="chevron-right"
                  loading={loading}
                  disabled={loading}
                />
              </FormikForm>
            )
          }}
        </Formik>
      </Container>
    </Layout.Vertical>
  )
}

export default OverviewStep
