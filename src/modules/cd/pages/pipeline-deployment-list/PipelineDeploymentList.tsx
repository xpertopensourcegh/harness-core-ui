import React from 'react'
import { Layout, Button, Popover } from '@wings-software/uikit'
import { Menu, MenuItem, Position } from '@blueprintjs/core'
import { Page } from 'modules/common/exports'
import i18n from './PipelineDeploymentList.i18n'

const PipelineDeploymentList: React.FC = (): JSX.Element => {
  const [buildFilter, setBuildFilter] = React.useState({ myBuild: false, running: false, failed: false })
  const [savedFilter, setSavedFilter] = React.useState(i18n.savedFilters)
  return (
    <>
      <Page.Header
        title={
          <Layout.Horizontal spacing="small">
            <Button
              round
              text={i18n.myBuilds}
              onClick={() => {
                setBuildFilter(prev => ({ ...prev, myBuild: !prev.myBuild }))
              }}
              intent={buildFilter.myBuild ? 'primary' : 'none'}
            />
            <Button
              round
              text={i18n.running}
              onClick={() => {
                setBuildFilter(prev => ({ ...prev, running: !prev.running, failed: prev.running }))
              }}
              intent={buildFilter.running ? 'primary' : 'none'}
            />
            <Button
              round
              text={i18n.failed}
              onClick={() => {
                setBuildFilter(prev => ({ ...prev, failed: !prev.failed, running: prev.failed }))
              }}
              intent={buildFilter.failed ? 'primary' : 'none'}
            />
          </Layout.Horizontal>
        }
        toolbar={
          <Layout.Horizontal spacing="small">
            <Popover
              minimal
              content={
                <Menu>
                  {/* Todo: Change to API*/}
                  <MenuItem
                    text="Filter 1"
                    onClick={() => {
                      setSavedFilter('Filter 1')
                    }}
                  />
                  <MenuItem
                    text="Filter 2"
                    onClick={() => {
                      setSavedFilter('Filter 2')
                    }}
                  />
                </Menu>
              }
              position={Position.BOTTOM}
            >
              <Button text={savedFilter} rightIcon="chevron-down"></Button>
            </Popover>
            <Button minimal icon="search" />
            <Button minimal icon="filter-list" />
          </Layout.Horizontal>
        }
      ></Page.Header>
    </>
  )
}

export default PipelineDeploymentList
