import React, { useState } from 'react'
import { useParams } from 'react-router'
import * as Yup from 'yup'

import {
  Layout,
  Formik,
  FormInput,
  Container,
  Button,
  FormikForm as Form,
  ModalErrorHandler,
  ModalErrorHandlerBinding,
  ButtonVariation
} from '@wings-software/uicore'
import {
  useCreateConnector,
  useUpdateConnector,
  ConnectorConfigDTO,
  ConnectorInfoDTO,
  Connector,
  CreateConnectorQueryParams
} from 'services/cd-ng'
import { getErrorInfoFromErrorObject, shouldShowError } from '@common/utils/errorUtils'
import { String, useStrings } from 'framework/strings'
import { PageSpinner, useToaster } from '@common/components'
import css from './ProviderDetailsStep.module.scss'

interface BuildPayloadProps {
  projectIdentifier: string
  orgIdentifier: string
  delegateSelectors: Array<string>
}

interface ConnectorCreateEditProps {
  payload?: Connector
}

const ProviderOverviewStep = (props: any) => {
  const { getString } = useStrings()
  const { showSuccess, showError } = useToaster()
  const { prevStepData, nextStep, buildPayload, customHandleCreate, customHandleUpdate, connectorInfo } = props

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const {
    accountId,
    projectIdentifier: projectIdentifierFromUrl,
    orgIdentifier: orgIdentifierFromUrl
  } = useParams<any>()
  const projectIdentifier = connectorInfo ? connectorInfo.projectIdentifier : projectIdentifierFromUrl
  const orgIdentifier = connectorInfo ? connectorInfo.orgIdentifier : orgIdentifierFromUrl
  const { mutate: createConnector, loading: creating } = useCreateConnector({
    queryParams: { accountIdentifier: accountId }
  })
  const { mutate: updateConnector, loading: updating } = useUpdateConnector({
    queryParams: { accountIdentifier: accountId }
  })
  const [connectorPayloadRef, setConnectorPayloadRef] = useState<Connector | undefined>()

  const handleCreateOrEdit = async (connectorData: ConnectorCreateEditProps): Promise<any> => {
    const payload = connectorData.payload || (connectorPayloadRef as Connector)
    modalErrorHandler?.hide()
    const queryParams: CreateConnectorQueryParams = {}

    const response = props.isEditMode
      ? await updateConnector(payload, {
          queryParams: {
            ...queryParams
          }
        })
      : await createConnector(payload, { queryParams: queryParams })

    return {
      status: response.status,
      nextCallback: afterSuccessHandler.bind(null, response)
    }
  }

  const isSaveButtonDisabled = creating || updating
  const connectorName = creating
    ? (prevStepData as ConnectorConfigDTO)?.name
    : (connectorInfo as ConnectorInfoDTO)?.name

  const afterSuccessHandler = (response: any): void => {
    props.onUpdateMode(true)
    nextStep?.({ ...props.connectorInfo, ...response?.data?.connector, ...prevStepData })
  }

  return (
    <>
      {creating || updating ? (
        <PageSpinner
          message={
            creating
              ? getString('connectors.creating', { name: connectorName })
              : getString('connectors.updating', { name: connectorName })
          }
        />
      ) : null}
      <Layout.Vertical spacing="xxlarge" className={css.stepContainer}>
        <div className={css.heading}>Provider Details</div>
        <ModalErrorHandler bind={setModalErrorHandler} />

        <Container padding="small" className={css.connectorForm}>
          <Formik
            initialValues={{
              adapterUrl: props?.prevStepData?.spec?.adapterUrl || props?.provider?.spec?.adapterUrl || ''
            }}
            validationSchema={Yup.object().shape({
              adapterUrl: Yup.string()
                .trim()
                .url('Please enter a valid Adapter URL')
                .required('Please enter a valid Adapter URL')
            })}
            formName="connectionDetails"
            onSubmit={(stepData: any) => {
              const updatedStepData = {
                ...stepData
              }

              const connectorData: BuildPayloadProps = {
                ...prevStepData,
                ...updatedStepData,
                projectIdentifier: projectIdentifier,
                orgIdentifier: orgIdentifier
              }

              const data = buildPayload(connectorData)
              setConnectorPayloadRef(data)

              if (customHandleUpdate || customHandleCreate) {
                props.isEditMode
                  ? customHandleUpdate?.(data, { ...prevStepData, ...updatedStepData }, props)
                  : customHandleCreate?.(data, { ...prevStepData, ...updatedStepData }, props)
              } else {
                handleCreateOrEdit({ payload: data }) /* Handling non-git flow */
                  .then(res => {
                    if (res.status === 'SUCCESS') {
                      props.isEditMode
                        ? showSuccess(getString('connectors.updatedSuccessfully'))
                        : showSuccess(getString('connectors.createdSuccessfully'))

                      res.nextCallback?.()
                    } else {
                      /* TODO handle error with API status 200 */
                    }
                  })
                  .catch(e => {
                    if (shouldShowError(e)) {
                      showError(getErrorInfoFromErrorObject(e))
                    }
                  })
              }
            }}
          >
            {() => (
              <Form>
                <Container style={{ minHeight: 460 }}>
                  <FormInput.Text
                    className={css.adapterUrl}
                    name="adapterUrl"
                    label={'Adapter URL'}
                    style={{ width: '60%' }}
                  />
                </Container>
                <Layout.Horizontal spacing="large">
                  <Button
                    variation={ButtonVariation.SECONDARY}
                    text={getString('back')}
                    icon="chevron-left"
                    onClick={() => props?.previousStep?.(props?.prevStepData)}
                    data-name="commonGitBackButton"
                  />
                  <Button
                    variation={ButtonVariation.PRIMARY}
                    type="submit"
                    intent="primary"
                    rightIcon="chevron-right"
                    disabled={isSaveButtonDisabled}
                  >
                    <String stringID="continue" />
                  </Button>
                </Layout.Horizontal>
              </Form>
            )}
          </Formik>
        </Container>
      </Layout.Vertical>
    </>
  )
}

export default ProviderOverviewStep
