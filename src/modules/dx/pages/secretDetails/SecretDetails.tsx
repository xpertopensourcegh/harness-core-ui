import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import cx from 'classnames'

import { useGetSecretText } from 'services/cd-ng'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import { PageError } from 'modules/common/components/Page/PageError'
import { Layout, Text, Color, Container, Button } from '@wings-software/uikit'
import { PageHeader } from 'modules/common/components/Page/PageHeader'
import { linkTo } from 'framework/exports'
import { routeResources } from 'modules/common/routes'
import YAMLBuilderPage from 'modules/dx/pages/yamlBuilder/YamlBuilderPage'
import { YamlEntity } from 'modules/common/constants/YamlConstants'
import ViewSecretDetails from './views/ViewSecretDetails'
import EditVisualSecret from './views/EditVisualSecret'

import i18n from './SecretDetails.i18n'
import css from './SecretDetails.module.scss'

enum Mode {
  VISUAL,
  YAML
}

const SecretDetails: React.FC = () => {
  const { accountId, secretId } = useParams()
  const [editing, setEditing] = useState(false)
  const [mode, setMode] = useState<Mode>(Mode.VISUAL)
  const { loading, data, refetch, error } = useGetSecretText({
    identifier: secretId,
    queryParams: { accountIdentifier: accountId }
  })

  if (loading) return <PageSpinner />
  if (error) return <PageError message={error.message} onClick={() => refetch()} />
  if (!data?.data) return <div>No Data</div>

  const secret = data?.data

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
              {secret.name}
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
          <div>
            {mode === Mode.VISUAL ? (
              <EditVisualSecret secret={secret} />
            ) : (
              <Layout.Vertical>
                <YAMLBuilderPage entityType={YamlEntity.SECRET} fileName={`${secret.name}.yaml`} />
              </Layout.Vertical>
            )}
          </div>
        ) : (
          <ViewSecretDetails secret={secret} />
        )}
      </Container>
    </>
  )
}

export default SecretDetails
