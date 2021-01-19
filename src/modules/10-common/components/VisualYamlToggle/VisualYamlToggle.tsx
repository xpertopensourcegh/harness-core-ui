import React from 'react'
import cx from 'classnames'
import { useStrings } from 'framework/exports'
import css from './VisualYamlToggle.module.scss'

enum SelectedView {
  VISUAL = 'VISUAL',
  YAML = 'YAML'
}

export default function VisualYamlToggle(): JSX.Element {
  const [selectedView, setSelectedView] = React.useState<SelectedView>(SelectedView.VISUAL)
  const { getString } = useStrings()

  return (
    <div className={css.optionBtns}>
      <div
        className={cx(css.item, { [css.selected]: selectedView === SelectedView.VISUAL })}
        onClick={() => setSelectedView(SelectedView.VISUAL)}
        tabIndex={0}
        role="button"
      >
        {getString('visual')}
      </div>
      <div
        className={cx(css.item, { [css.selected]: selectedView === SelectedView.YAML })}
        onClick={() => setSelectedView(SelectedView.YAML)}
        tabIndex={0}
        role="button"
      >
        {getString('yaml')}
      </div>
    </div>
  )
}
