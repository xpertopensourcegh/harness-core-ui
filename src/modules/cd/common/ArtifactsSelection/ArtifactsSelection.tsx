import React from 'react'
import { Layout, Text, Container, Icon, Color } from '@wings-software/uikit'
import css from './ArtifactsSelection.module.scss'
import i18n from './ArtifactsSelection.i18n'
import cx from 'classnames'
interface ArtifactTable {
  [key: string]: string
}

interface PrimaryArtifactDataset {
  type: string
  server: { name: string; type: string }
  status: string
  source: string
  id: string
}

const artifactListHeaders: ArtifactTable = {
  type: i18n.artifactTable.type,
  server: i18n.artifactTable.server,
  source: i18n.artifactTable.artifactSource,
  id: i18n.artifactTable.id
}

const samplePrimaryArtifactData: PrimaryArtifactDataset[] = [
  {
    type: 'PRIMARY',
    server: {
      type: 'service-gcp',
      name: 'My GCR Server 1'
    },
    status: 'ACTIVE',
    source: 'Registry Host / Docker Image Name Pretty Long text which cannot fit',
    id: 'artifact'
  }
]

const samplesideCarArtifactData: PrimaryArtifactDataset[] = [
  {
    type: 'SIDECAR',
    server: {
      type: 'service-jenkins',
      name: 'My GCR Server 1'
    },
    status: 'ACTIVE',
    source: 'Registry Host / Docker Image Name',
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

function AddArtifactSidecarRender(): JSX.Element {
  return (
    <Layout.Vertical spacing="medium">
      <Container className={css.rowItem}>
        <Text>{i18n.addPrimarySourceLable}</Text>
      </Container>
      <Container className={css.rowItem}>
        <Text>{i18n.addSideCarLable}</Text>
      </Container>
    </Layout.Vertical>
  )
}

function ArtifactsListView(): JSX.Element {
  return (
    <Layout.Vertical spacing="small">
      <Container>
        <section className={css.thead}>
          <span>{artifactListHeaders.type}</span>
          <span>{artifactListHeaders.server}</span>
          <span></span>
          <span>{artifactListHeaders.source}</span>
          <span>{artifactListHeaders.id}</span>
          <span></span>
        </section>
      </Container>
      <Layout.Vertical spacing="medium">
        <section>
          {samplePrimaryArtifactData.map((data, index) => {
            return (
              <section className={cx(css.thead, css.rowItem)} key={data.source + index}>
                <span className={css.type}>{data.type === 'PRIMARY' ? i18n.primaryLabel : i18n.sidecarLabel}</span>
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
                    {data.source}
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
        <section>
          {samplesideCarArtifactData.map((data, index) => {
            return (
              <section className={cx(css.thead, css.rowItem)} key={data.source + index}>
                <span className={css.type}>{data.type === 'PRIMARY' ? i18n.primaryLabel : i18n.sidecarLabel}</span>
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
                    {data.source}
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
          {i18n.addSideCarLable}
        </Text>
      </Layout.Vertical>
    </Layout.Vertical>
  )
}

export default function ArtifactsSelection(): JSX.Element {
  return (
    <Layout.Vertical padding="large" style={{ background: 'var(--grey-100)' }}>
      <Text style={{ color: 'var(--grey-500)', lineHeight: '24px' }}>{i18n.info}</Text>
      <AddArtifactSidecarRender />
      <ArtifactsListView />
    </Layout.Vertical>
  )
}
