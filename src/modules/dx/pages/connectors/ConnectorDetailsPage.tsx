import React from 'react'
import { Layout, Container } from '@wings-software/uikit'
import { Tag } from '@blueprintjs/core'
import i18n from './ConnectorDetailsPage.i18n'
import css from './ConnectorDetailsPage.module.scss'
import ConfigureConnector from './ConfigureConnector'
import { Page } from 'modules/common/exports'
import cx from 'classnames'
import { connector } from './ConnectorMockData'

interface Categories {
  [key: string]: string
}

const categories: Categories = {
  connection: i18n.connection,
  refrencedBy: i18n.refrencedBy,
  activityHistory: i18n.activityHistory
}

const ConnectorDetailsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState(0)

  return (
    <>
      <Page.Header
        title={i18n.title}
        toolbar={
          <Container>
            <Layout.Horizontal spacing="medium">
              {Object.keys(categories).map((data, index) => {
                return (
                  <Tag
                    className={cx(css.tags, { [css.activeTag]: activeCategory === index })}
                    onClick={() => setActiveCategory(index)}
                    key={data + index}
                  >
                    {categories[data]}
                  </Tag>
                )
              })}
            </Layout.Horizontal>
          </Container>
        }
      />
      <Page.Body>
        <ConfigureConnector connector={connector} enableEdit={false} />
      </Page.Body>
    </>
  )
}

export default ConnectorDetailsPage
