import React from 'react'
import { Layout, Text, Container, Icon, Color } from '@wings-software/uikit'
import css from './ManifestSelection.module.scss'
import i18n from './ManifestSelection.i18n'
import cx from 'classnames'
interface ManifestTable {
  [key: string]: string
}

interface PrimaryArtifactDataset {
  type: string
  server: { name: string; type: string }
  status: string
  location: string
  id: string
}

const artifactListHeaders: ManifestTable = {
  type: i18n.manifestTable.type,
  server: i18n.manifestTable.server,
  location: i18n.manifestTable.location,
  id: i18n.manifestTable.id
}

const samplePrimaryArtifactData: PrimaryArtifactDataset[] = [
  {
    type: 'PRIMARY',
    server: {
      type: 'service-artifactory',
      name: 'My Git Server 1'
    },
    status: 'ACTIVE',
    location: '/folder/package',
    id: 'artifact'
  }
]

function EditCloneDelete(): JSX.Element {
  return (
    <Layout.Horizontal spacing="medium">
      <Icon name="main-edit" size={14} />
      <Icon name="main-clone" size={14} />
      <Icon name="delete" size={14} />
    </Layout.Horizontal>
  )
}

function AddManifestRender(): JSX.Element {
  return (
    <Layout.Vertical spacing="medium">
      <Container className={css.rowItem}>
        <Text>{i18n.addPrimarySourceLable}</Text>
      </Container>
    </Layout.Vertical>
  )
}

function ManifestListView(): JSX.Element {
  return (
    <Layout.Vertical spacing="small">
      <Container>
        <section className={css.thead}>
          <span>{artifactListHeaders.type}</span>
          <span>{artifactListHeaders.server}</span>
          <span></span>
          <span>{artifactListHeaders.location}</span>
          <span>{artifactListHeaders.id}</span>

          <span></span>
        </section>
      </Container>
      <Layout.Vertical spacing="medium">
        <section>
          {samplePrimaryArtifactData.map((data, index) => {
            return (
              <section className={cx(css.thead, css.rowItem)} key={data.location + index}>
                <span className={css.type}>{data.type === 'PRIMARY' ? i18n.manifestTypeLabelPrimary : data.type}</span>
                <span className={css.server}>
                  <Text
                    inline
                    icon={data.server.type as any}
                    iconProps={{ size: 18 }}
                    width={200}
                    style={{ color: Color.BLACK, fontWeight: 900 }}
                  >
                    {data.server.name}
                  </Text>
                </span>
                <span>
                  <Text
                    inline
                    icon="full-circle"
                    iconProps={{ size: 10, color: data.status === 'ACTIVE' ? Color.GREEN_500 : Color.RED_500 }}
                  />
                </span>
                <span>
                  <Text width={280} lineClamp={1} style={{ color: Color.GREY_500 }}>
                    {data.location}
                  </Text>
                </span>
                <span>
                  <Text width={140} lineClamp={1} style={{ color: Color.GREY_500 }}>
                    {data.id}
                  </Text>
                </span>
                <span>
                  <EditCloneDelete />
                </span>
              </section>
            )
          })}
        </section>

        <Text intent="primary" style={{ cursor: 'pointer' }}>
          {i18n.addFileLabel}
        </Text>
      </Layout.Vertical>
    </Layout.Vertical>
  )
}

export default function ManifestSelection(): JSX.Element {
  return (
    <Layout.Vertical padding="large" style={{ background: 'var(--grey-100)' }}>
      <Text style={{ color: 'var(--grey-500)', lineHeight: '24px' }}>{i18n.info}</Text>
      <AddManifestRender />
      <ManifestListView />
    </Layout.Vertical>
  )
}
