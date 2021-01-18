import React from 'react'
import { get } from 'lodash-es'
import { Dialog, Spinner } from '@blueprintjs/core'
import { Button, Layout, useModalHook, Formik, FormInput, CardSelect, Container, Label } from '@wings-software/uicore'
import { ApiKey, useAddAPIKey } from 'services/cf/index'
import { useEnvStrings } from '@cf/hooks/environment'
import { useToaster } from '@common/exports'
import type { EnvironmentResponseDTO } from 'services/cd-ng'
import css from './AddKeyDialog.module.scss'

interface Props {
  disabled?: boolean
  primary?: boolean
  environment: EnvironmentResponseDTO
  onCreate: (newKey: ApiKey, hideModal: () => void) => void
}

const SERVER = 'Server'
const CLIENT = 'Client'
type KeyType = typeof CLIENT | typeof SERVER

interface KeyValues {
  name: string
  type: KeyType
}

const AddKeyDialog: React.FC<Props> = ({ disabled, primary, environment, onCreate }) => {
  const { showError } = useToaster()
  const { getString, getEnvString } = useEnvStrings()
  const { mutate: createKey, loading } = useAddAPIKey({
    queryParams: {
      account: environment.accountId as string,
      environment: environment.identifier as string,
      org: environment.orgIdentifier as string,
      project: environment.projectIdentifier as string
    }
  })

  const keyTypes = [
    {
      text: getEnvString('apiKeys.clientType'),
      value: CLIENT
    },
    {
      text: getEnvString('apiKeys.serverType'),
      value: SERVER
    }
  ]

  const initialValues: KeyValues = {
    name: '',
    type: SERVER
  }

  const getTypeOption = (value: string) => keyTypes.find(k => k.value === value) || keyTypes[0]

  const handleSubmit = (values: KeyValues) => {
    createKey({
      identifier: values.name,
      name: values.name,
      type: values.type
    })
      .then((created: ApiKey) => onCreate(created, hideModal))
      .catch(error => showError(get(error, 'data.error', error?.message)))
  }

  const [openModal, hideModal] = useModalHook(() => {
    return (
      <Dialog isOpen onClose={hideModal} title="Create SDK Key">
        <Formik initialValues={initialValues} onSubmit={handleSubmit} onReset={hideModal}>
          {formikProps => (
            <Layout.Vertical spacing="large" padding="xxlarge">
              <Layout.Vertical spacing="small">
                <Label>{getString('name')}</Label>
                <FormInput.Text name="name" />
              </Layout.Vertical>
              <Layout.Vertical spacing="small">
                <Label>{getEnvString('apiKeys.keyType')}</Label>
                <CardSelect
                  cornerSelected
                  data={keyTypes}
                  selected={getTypeOption(formikProps.values.type)}
                  className={css.cardSelect}
                  onChange={nextValue => formikProps.setFieldValue('type', nextValue.value)}
                  renderItem={cardData => (
                    <Container flex={{ align: 'center-center', distribution: 'space-between' }} className="cardBody">
                      {cardData.text}
                    </Container>
                  )}
                />
              </Layout.Vertical>
              <Container>
                <Layout.Horizontal>
                  <Button
                    text={getString('createSecretYAML.create')}
                    onClick={() => formikProps.handleSubmit()}
                    intent="primary"
                    disabled={loading}
                  />
                  <Button text={getString('cancel')} onClick={() => formikProps.handleReset()} minimal />
                  {loading && <Spinner size={16} />}
                </Layout.Horizontal>
              </Container>
            </Layout.Vertical>
          )}
        </Formik>
      </Dialog>
    )
  }, [loading])

  return (
    <Button
      disabled={disabled}
      onClick={openModal}
      text={`+ ${getString('cf.environments.apiKeys.addKey')}`}
      minimal={!primary}
      intent={primary ? 'primary' : undefined}
    />
  )
}

export default AddKeyDialog
