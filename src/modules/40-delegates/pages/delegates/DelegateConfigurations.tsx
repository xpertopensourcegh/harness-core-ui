import React from 'react'
import { Menu } from '@blueprintjs/core'
import { Card, Text, CardBody, Layout, Tag, Intent, Container } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import { useStrings } from 'framework/exports'
import { getDelegateProfilesV2, DelegateProfile } from 'services/portal'
import css from './DelegatesPage.module.scss'

const renderTags = (tags: string[]) => {
  /* istanbul ignore next */
  if (!tags) {
    return null
  }
  /* istanbul ignore next */
  return (
    <>
      {tags.map((tag: string) => {
        return (
          <Tag key={tag} intent={Intent.PRIMARY}>
            {tag}
          </Tag>
        )
      })}
    </>
  )
}

export default function DelegateConfigurations(): JSX.Element {
  const { accountId } = useParams()
  const { getString } = useStrings()
  const { data } = getDelegateProfilesV2({ queryParams: { accountId } })
  /* istanbul ignore next */
  if (data) {
    const { resource } = data
    if (resource) {
      const profiles = resource?.response
      return (
        <Container className={css.profileContainer}>
          {profiles.map((item: DelegateProfile) => {
            return (
              <Card interactive={false} elevation={0} selected={false} className={css.profileCard} key={item.name}>
                <CardBody.Menu
                  menuContent={
                    <Menu>
                      <Menu.Item icon="edit" text={getString('edit')} />
                      <Menu.Item icon="cross" text={getString('delete')} />
                    </Menu>
                  }
                >
                  <Text font={{ size: 'medium', weight: 'bold' }}>{item.name}</Text>

                  <Layout.Vertical spacing="medium" padding={{ top: 'medium' }} className={css.content}>
                    <div>
                      <Text style={{ marginTop: '5px' }} font="small">
                        {item.description}
                      </Text>
                    </div>
                    {item.selectors && <div>{renderTags(item?.selectors)}</div>}
                  </Layout.Vertical>

                  {item.lastUpdatedAt && (
                    <div>
                      <hr />
                      <Text font="small" style={{ marginBottom: '5px', color: 'var(--grey-350)' }}>
                        {getString('tableColumnNames.lastUpdatedOn')}
                      </Text>
                      <Text font="small">{item.lastUpdatedAt}</Text>
                    </div>
                  )}
                </CardBody.Menu>
              </Card>
            )
          })}
        </Container>
      )
    }
  }
  /* istanbul ignore next */
  return <div />
}
