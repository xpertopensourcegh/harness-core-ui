import React from 'react'
import { Layout } from '@wings-software/uikit'
import { ExecutionGraph } from 'modules/pipeline/exports'
import css from './BuildStageSetupShell.module.scss'

export default function BuildStageSetupShell(): JSX.Element {
  return (
    <section className={css.setupShell}>
      <Layout.Horizontal margin="small" className={css.execution}>
        <ExecutionGraph />
      </Layout.Horizontal>
    </section>
  )
}
