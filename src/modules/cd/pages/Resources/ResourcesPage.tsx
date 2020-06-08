import React from 'react'
import { Layout, Container } from '@wings-software/uikit'
import { Tag } from '@blueprintjs/core'
import i18n from './ResourcesPage.i18n'
import css from './ResourcesPage.module.scss'
import cx from 'classnames'
import CustomTable from '../../../common/components/CustomTable/CustomTable'
import { data as rowData, columns } from './SampleColumnsData'
import { DelegateSetupModal } from '../../modals/DelegateSetupModal/DelegateSetupModal'
import { Page } from 'modules/common/exports'

interface Categories {
  [key: string]: string
}

const categories: Categories = {
  connectors: i18n.connectors,
  secrets: i18n.secrets,
  delegates: i18n.delegates,
  tempaltes: i18n.templates,
  fileStore: i18n.fileStore
}

const ResourcesPage: React.FC = () => {
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
                    className={cx(css.tags, activeCategory === index && css.activeTag)}
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
        <Layout.Vertical style={{ background: 'var(--grey-100)' }}>
          <Container>
            <Layout.Horizontal
              id="layout-horizontal-sample"
              spacing="none"
              padding="xlarge"
              style={{
                borderTop: '1px solid var(--grey-200)',
                borderBottom: '1px solid var(--grey-200)',
                background: 'white'
              }}
            >
              <div style={{ width: 200 }}>
                <DelegateSetupModal />
              </div>
              <div style={{ flexGrow: 1 }}></div>
            </Layout.Horizontal>
          </Container>
          <Container style={{ height: '100%' }}>
            <Layout.Horizontal style={{ height: '100%' }}>
              <CustomTable data={rowData} columns={columns} />
            </Layout.Horizontal>
          </Container>
        </Layout.Vertical>
      </Page.Body>
    </>
  )
}

export default ResourcesPage
