import React from 'react'
import css from './PipelineCanvas.module.scss'
import { Classes } from '@blueprintjs/core'
import i18n from '../PipelineStudio.i18n'
import cx from 'classnames'
import { Layout, Icon, Text, Link } from '@wings-software/uikit'
import ExecutionGraph from '../ExecutionGraph/ExecutionGraph'

const PipelineCanvas = (): JSX.Element => (
  <div className={css.container}>
    <div className={css.leftBar}>
      <div>
        <Link noStyling title="Dashboard" href="/">
          <Icon name="harness" size={29} className={css.logoImage} />
        </Link>
        <Text className={css.title}>{i18n.pipelineStudio}</Text>
      </div>
      <div>
        <Link noStyling title="Dashboard" href="/">
          <Icon name="cross" margin="small" padding="xsmall" size={15} className={css.logoImage} />
        </Link>
      </div>
    </div>
    <div
      className={cx(Classes.POPOVER_DISMISS, css.content)}
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <div className={css.topBar}>
        <div className={cx(css.topButtons, css.selected)}>VISUAL</div>
        <div className={css.topButtons}>YAML</div>
        <div className={css.topButtons}>SPLIT</div>
      </div>
      <div className={css.secondaryBar}>
        <Icon name="search-pipelines" />
      </div>
      <Layout.Horizontal className={css.canvas} padding="medium">
        <ExecutionGraph />
      </Layout.Horizontal>
    </div>
    <div className={css.rightBar}></div>
  </div>
)

export default PipelineCanvas
