import React from 'react'
import { Card, Container, Text, Tag, Intent, CodeBlock, Layout } from '@wings-software/uicore'
import { Link, useParams } from 'react-router-dom'
import { Page } from '@common/exports'
import routes from '@common/RouteDefinitions'
import { useStrings } from 'framework/exports'
import { useGetDelegateConfigFromId } from 'services/portal'
import css from './DelegateProfileDetails.module.scss'

const getTags = (tags: string[]) => {
  return tags.map((tag: string) => {
    return (
      <Tag intent={Intent.PRIMARY} minimal={true} key={tag}>
        <span>{tag}</span>
      </Tag>
    )
  })
}
export default function DelegateProfileDetails(): JSX.Element {
  const { getString } = useStrings()
  const { delegateConfigId, accountId } = useParams()

  const { data } = useGetDelegateConfigFromId({
    delegateProfileId: delegateConfigId,
    queryParams: { accountId }
  })
  const profile = data?.resource

  const renderTitle = () => {
    return (
      <Layout.Vertical>
        <Layout.Horizontal spacing="xsmall">
          <Link
            to={routes.toResourcesDelegates({
              accountId
            })}
          >
            Resources
          </Link>
          <span>/</span>
          <Link
            to={routes.toResourcesDelegates({
              accountId
            })}
          >
            Delegates
          </Link>
        </Layout.Horizontal>
        <span>test</span>
      </Layout.Vertical>
    )
  }
  return (
    <>
      <Page.Header title={renderTitle()} />
      <Page.Body className={css.main}>
        <Layout.Vertical>
          <Container>
            <div className={css.optionBtns}>
              <div className={css.item}>{getString('visual')}</div>
              <div className={css.item}>{getString('yaml')}</div>
            </div>
          </Container>
        </Layout.Vertical>
        <Layout.Horizontal spacing="medium" className={css.configurationContainer}>
          <Container className={css.cardContainer}>
            <Card key={`${profile?.uuid}-overview`} className={`${css.overview}`}>
              <Layout.Vertical spacing="large">
                <div>
                  <Text font="medium">{getString('overview')}</Text>

                  <div>
                    <Text font="small" style={{ marginBottom: '5px', color: 'var(--grey-350)' }}>
                      {getString('delegate.CONFIGURATION_NAME')}
                    </Text>
                    <Text font="small">{profile?.name}</Text>
                  </div>
                  <hr style={{ border: '1px solid var(--grey-350)' }} />
                  <div>
                    <Text font="small" style={{ marginBottom: '5px', color: 'var(--grey-350)' }}>
                      {getString('description')}
                    </Text>
                    <Text font="small">{profile?.description}</Text>
                  </div>

                  {profile?.selectors && (
                    <div>
                      <hr style={{ border: '1px solid var(--grey-350)' }} />
                      <Text font="small" style={{ marginBottom: '5px', color: 'var(--grey-350)' }}>
                        {getString('tagsLabel')}
                      </Text>
                      {getTags(profile?.selectors)}
                    </div>
                  )}
                </div>
              </Layout.Vertical>
            </Card>
            {profile?.scopingRules && profile?.scopingRules.length > 0 && (
              <Card>
                <Text font="medium">{getString('delegate.Scope')} </Text>
                <Text font="normal">{getString('delegate.ScopeDescription')}</Text>
              </Card>
            )}
          </Container>
          <Card className={`${css.initScript}`}>
            <Text font="medium"> {getString('delegate.Init_Script')}</Text>
            <CodeBlock allowCopy format="pre" snippet={profile?.startupScript} />
          </Card>
        </Layout.Horizontal>
      </Page.Body>
    </>
  )
}
