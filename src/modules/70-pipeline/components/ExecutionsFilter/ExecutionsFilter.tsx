import { Button, Layout, Select } from '@wings-software/uikit'
import cx from 'classnames'
import React from 'react'
import i18n from './ExecutionsFilter.i18n'
import css from './ExecutionsFilter.module.scss'

//
// TODO: ExecutionsFilter is not finalized on both Design and API.
// UI just implements place-holders for now.
//
export const ExecutionFilter: React.FC = () => {
  return (
    <>
      <Layout.Horizontal spacing="small">
        <Button
          className={cx(css.roundedButton, css.selected)}
          text={i18n.myDeployments}
          onClick={() => alert('To be implemented')}
        />
        <Button className={css.roundedButton} text={i18n.running} onClick={() => alert('To be implemented')} />
        <Button className={css.roundedButton} text={i18n.failed} onClick={() => alert('To be implemented')} />
      </Layout.Horizontal>

      <Layout.Horizontal spacing="large">
        <Select
          inputProps={{ placeholder: i18n.selectSavedFilter }}
          items={[
            { label: 'Running Only', value: 'running-only' },
            { label: 'Failed Only', value: 'service-elk' }
          ]}
          onChange={item => alert('To be implemented ' + item.label)}
        />

        <Layout.Horizontal inline spacing="small">
          <Button minimal icon="search" onClick={() => alert('To be implemented')} />
          <Button minimal icon="settings" onClick={() => alert('To be implemented')} />
        </Layout.Horizontal>
      </Layout.Horizontal>
    </>
  )
}
