import React from 'react'
import { Popover, Button, Layout, TextInput } from '@wings-software/uikit'
import { Menu, MenuItem, Position } from '@blueprintjs/core'
import { Page } from 'modules/common/exports'
import i18n from './InputSetList.i18n'
import css from './InputSetList.module.scss'

const InputSetList: React.FC = (): JSX.Element => {
  const [searchParam, setSearchParam] = React.useState('')
  return (
    <>
      <Page.Header
        title={
          <Popover
            minimal
            content={
              <Menu>
                <MenuItem text={i18n.inputSet} />
                <MenuItem text={i18n.overlayInputSet} />
              </Menu>
            }
            position={Position.BOTTOM}
          >
            <Button text={i18n.newInputSet} rightIcon="caret-down" intent="primary"></Button>
          </Popover>
        }
        toolbar={
          <Layout.Horizontal spacing="small">
            <TextInput
              leftIcon="search"
              placeholder={i18n.searchInputSet}
              className={css.search}
              value={searchParam}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchParam(e.target.value.trim())
              }}
            />
          </Layout.Horizontal>
        }
      ></Page.Header>
    </>
  )
}

export default InputSetList
