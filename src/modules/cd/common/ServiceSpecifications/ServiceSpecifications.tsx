import React from 'react'
import { Layout, Tabs, Tab } from '@wings-software/uikit'
import css from './ServiceSpecifications.module.scss'
import i18n from './ServiceSpecifications.i18n'
import ArtifactsSelection from '../ArtifactsSelection/ArtifactsSelection'
import ManifestSelection from '../ManifestSelection/ManifestSelection'

export default function ServiceSpecifications(): JSX.Element {
  return (
    <section className={css.serviceOverrides}>
      <Layout.Horizontal spacing="small">
        <Tabs id="serviceSpecifications">
          <Tab id={i18n.artifacts} title={i18n.artifacts} panel={<ArtifactsSelection />} />
          <Tab id={i18n.manifests} title={i18n.manifests} panel={<ManifestSelection />} />
          <Tab id={i18n.variables} title={i18n.variables} panel={<span>In Progress..</span>} />
        </Tabs>
      </Layout.Horizontal>
    </section>
  )
}
