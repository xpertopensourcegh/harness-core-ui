import React, { useState } from 'react'
import { Tabs, Tab, Icon, IconName } from '@wings-software/uikit'
import ContentEditable from 'react-contenteditable'
import cx from 'classnames'
import css from './CVOnboardingTabs.module.scss'

interface CVTabProps {
  defaultEntityName: string
  setName: (val: string) => void
  iconName: IconName
  tabProps: any[]
  onNext: (prevTab?: number, newTab?: number) => void
  onPrevious: (prevTab?: number, newTab?: number) => void
  currentTab: number
  maxEnabledTab: number
}

const CVOnboardingTabs: React.FC<CVTabProps> = props => {
  const [editable, setEditable] = useState(false)

  return (
    <div className={css.tabWrapper}>
      <Tabs
        className={css.tabWrapper}
        id="monitoring-sources"
        selectedTabId={props.currentTab}
        defaultSelectedTabId={1}
        onChange={(newTabId: number, prevTabId: number, event) => {
          if (newTabId === 0) {
            event.preventDefault()
          } else if (newTabId > prevTabId) {
            props.onNext(prevTabId, newTabId)
          } else if (newTabId < prevTabId) {
            props.onPrevious(prevTabId, newTabId)
          }
        }}
      >
        <Tab
          id={0}
          title={
            <div>
              <Icon name={props.iconName} size={16} className={css.nameTypeIcon} />
              <ContentEditable
                html={props.defaultEntityName}
                disabled={!editable}
                className={cx({ [css.editable]: editable })}
                tagName="span"
                onChange={ev => {
                  props.setName(ev.target.value)
                }}
                onBlur={() => {
                  setEditable(false)
                }}
                onKeyPress={event => {
                  if (event.key === 'Enter') {
                    setEditable(false)
                  }
                }}
              />
              <Icon
                name="edit"
                size={12}
                className={css.nameEditIcon}
                onClick={() => {
                  setEditable(true)
                }}
              />
            </div>
          }
          panel={<></>}
        />
        {props.tabProps?.map((item, index) => {
          return (
            <Tab
              key={`${item}${index}`}
              id={item.id}
              title={item.title}
              panel={item.component}
              disabled={item.id <= props.currentTab || item.id <= props.maxEnabledTab ? false : true}
            />
          )
        })}
      </Tabs>
    </div>
  )
}

export default CVOnboardingTabs
