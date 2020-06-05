import React from 'react'
import { Layout, Container, Text } from '@wings-software/uikit'
import { Tag } from '@blueprintjs/core'
import i18n from './ResourcesPage.i18n'
import css from './ResourcesPage.module.scss'
import cx from 'classnames'
import ResourceTable from './views/ResourceTable/ResourceTable'
import { data as rowData, columns } from './SampleColumnsData'
import { DelegateSetupModal } from '../../modals/DelegateSetupModal/DelegateSetupModal'

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
    <Layout.Vertical style={{ height: '100%' }}>
      <Container>
        <Layout.Horizontal
          id="layout-horizontal-sample"
          spacing="none"
          flex={true}
          padding="xlarge"
          style={{ borderBottom: '1px solid var(--grey-200)' }}
        >
          <div>
            <Text font="medium" style={{ textTransform: 'uppercase', color: 'var(--grey-700)', fontWeight: 700 }}>
              {i18n.title}
            </Text>
          </div>

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
        </Layout.Horizontal>
      </Container>
      <Container>
        <Layout.Horizontal
          id="layout-horizontal-sample"
          spacing="none"
          padding="xlarge"
          style={{ borderBottom: '1px solid var(--grey-200)' }}
        >
          <div style={{ width: 200 }}>
            <DelegateSetupModal />
          </div>
          <div style={{ flexGrow: 1 }}></div>
        </Layout.Horizontal>
      </Container>
      <Container style={{ height: '100%' }}>
        <Layout.Horizontal style={{ background: 'var(--grey-100)', height: '100%' }}>
          <ResourceTable data={rowData} columns={columns} />
        </Layout.Horizontal>
      </Container>
    </Layout.Vertical>
  )
}

export default ResourcesPage
