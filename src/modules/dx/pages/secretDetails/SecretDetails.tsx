import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { stringify, parse } from 'yaml'
import cx from 'classnames'
import * as Yup from 'yup'
import { Formik, FormikProps } from 'formik'
import { pick } from 'lodash-es'
import { Layout, Text, Color, Container, Button, FormikForm } from '@wings-software/uikit'

import { useGetSecretText, useUpdateSecretText } from 'services/cd-ng'
import type { EncryptedDataDTO, SecretTextUpdateDTO } from 'services/cd-ng'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import { PageError } from 'modules/common/components/Page/PageError'
import { PageHeader } from 'modules/common/components/Page/PageHeader'
import { linkTo } from 'framework/exports'
import { routeResources } from 'modules/common/routes'
import YAMLBuilderPage from 'modules/dx/pages/yamlBuilder/YamlBuilderPage'
import type { YamlBuilderHandlerBinding } from 'modules/common/interfaces/YAMLBuilderProps'
import { YamlEntity } from 'modules/common/constants/YamlConstants'
import ViewSecretDetails from './views/ViewSecretDetails'
import EditVisualSecret from './views/EditVisualSecret'

import i18n from './SecretDetails.i18n'
import css from './SecretDetails.module.scss'

enum Mode {
  VISUAL,
  YAML
}

interface SecretForm extends EncryptedDataDTO {
  value?: string
}

const SecretDetails: React.FC = () => {
  const { accountId, secretId } = useParams()
  const [editing, setEditing] = useState(false)
  const [mode, setMode] = useState<Mode>(Mode.VISUAL)
  const [yamlHandler, setYamlHandler] = React.useState<YamlBuilderHandlerBinding | undefined>()
  const { loading, data, refetch, error } = useGetSecretText({
    identifier: secretId,
    queryParams: { accountIdentifier: accountId }
  })
  const { mutate: updateSecret, loading: updating } = useUpdateSecretText({
    queryParams: { accountIdentifier: accountId },
    identifier: secretId || ''
  })
  const [secretData, setSecretData] = useState(data?.data)

  const handleSubmit = async (formData: EncryptedDataDTO): Promise<void> => {
    const dataToSubmit: SecretTextUpdateDTO = pick(formData, ['value', 'path'])
    try {
      await updateSecret(dataToSubmit)
      setEditing(false)
      refetch()
    } catch (e) {
      // handle error
    }
  }

  useEffect(() => {
    setSecretData(data?.data)
  }, [data?.data])

  useEffect(() => {
    if (mode === Mode.VISUAL) {
      const yamlData = parse(yamlHandler?.getLatestYaml() || '')
      if (yamlData) {
        setSecretData(yamlData)
      }
    }
  }, [mode, yamlHandler?.getLatestYaml])

  if (loading) return <PageSpinner />
  if (error) return <PageError message={error.message} onClick={() => refetch()} />
  if (!secretData) return <div>No Data</div>

  return (
    <>
      <PageHeader
        title={
          <Layout.Vertical>
            <div>
              <Link to={linkTo(routeResources)}>{i18n.linkResources}</Link> /{' '}
              <Link to={linkTo(routeResources) + '/secrets'}>{i18n.linkSecrets}</Link>
            </div>
            <Text font={{ size: 'medium' }} color={Color.BLACK}>
              {secretData.name}
            </Text>
          </Layout.Vertical>
        }
      />
      <Container padding="large">
        <div className={css.switch}>
          <div className={cx(css.item, { [css.selected]: mode === Mode.VISUAL })} onClick={() => setMode(Mode.VISUAL)}>
            Visual
          </div>
          <div className={cx(css.item, { [css.selected]: mode === Mode.YAML })} onClick={() => setMode(Mode.YAML)}>
            YAML
          </div>
        </div>
        <Layout.Horizontal spacing="medium" margin={{ bottom: 'large', top: 'large' }} style={{ alignItems: 'center' }}>
          <Text font={{ size: 'medium' }} color={Color.BLACK}>
            {i18n.title}
          </Text>
          {editing ? null : (
            <Button
              text={i18n.buttonEdit}
              icon="edit"
              onClick={() => {
                setEditing(true)
              }}
            />
          )}
        </Layout.Horizontal>
        {editing ? (
          <Formik
            initialValues={{
              name: secretData.name,
              value: '',
              identifier: secretData.identifier,
              secretManagerIdentifier: secretData.secretManagerIdentifier,
              description: secretData.description || '',
              tags: secretData.tags
            }}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              name: Yup.string().trim().required(i18n.validateName),
              secretManagerIdentifier: Yup.string().required(i18n.validateSecretManager)
            })}
            validate={formData => {
              setSecretData(formData)
            }}
            onSubmit={formData => {
              handleSubmit(formData)
            }}
          >
            {(_formikProps: FormikProps<SecretForm>) => (
              <FormikForm>
                {mode === Mode.VISUAL ? (
                  <EditVisualSecret />
                ) : (
                  <YAMLBuilderPage
                    entityType={YamlEntity.SECRET}
                    fileName={`${secretData.name}.yaml`}
                    existingYaml={stringify(secretData)}
                    bind={setYamlHandler}
                  />
                )}
                <Button
                  intent="primary"
                  type="submit"
                  text={i18n.buttonSubmit}
                  margin={{ top: 'large' }}
                  disabled={updating}
                />
              </FormikForm>
            )}
          </Formik>
        ) : mode === Mode.VISUAL ? (
          <ViewSecretDetails secret={secretData} />
        ) : (
          <YAMLBuilderPage
            entityType={YamlEntity.SECRET}
            fileName={`${secretData.name}.yaml`}
            existingYaml={stringify(secretData)}
            isReadOnlyMode={true}
            showSnippetsSection={false}
          />
        )}
      </Container>
    </>
  )
}

export default SecretDetails
