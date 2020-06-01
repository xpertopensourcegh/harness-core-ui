import React, { useState } from 'react'
import { RadioSelect, Text, Layout, Icon, StepProps, IconName } from '@wings-software/uikit'
import type { SharedData } from '../ProjectsPage'
import i18n from '../ProjectsPage.i18n'

import css from './Step.module.scss'

interface ProjectType {
  title: string
  icon: IconName
}

const StepOne: React.FC<StepProps<SharedData>> = ({ nextStep }) => {
  const [selected, setSelected] = useState<ProjectType>()

  return (
    <Layout.Vertical padding="small" style={{ padding: '120px 30px' }}>
      <Text font="large" padding="small" style={{ textTransform: 'uppercase' }}>
        {i18n.newProjectWizard.stepOne.name.toUpperCase()}
      </Text>
      <Text padding="small" style={{ textTransform: 'uppercase', color: 'var(--grey-400)' }}>
        {i18n.newProjectWizard.stepOne.recommended}
      </Text>
      <br />
      <RadioSelect<ProjectType>
        selected={selected}
        onChange={value => {
          setSelected(value)
          nextStep?.()
        }}
        className={css.radioSelect}
        data={[
          {
            title: i18n.newProjectWizard.stepOne.newProject,
            icon: 'document'
          },
          {
            title: i18n.newProjectWizard.stepOne.cloneProject,
            icon: 'duplicate'
          },
          {
            title: i18n.newProjectWizard.stepOne.importProject,
            icon: 'document-open'
          }
        ]}
        renderItem={item => (
          <>
            <Icon name={item.icon} size={32} padding="small" />
            <Text
              font={{ size: 'small' }}
              style={{
                color: selected ? 'var(--blue-800)' : 'parent',
                textTransform: 'uppercase',
                width: '110px',
                paddingTop: '7px'
              }}
            >
              {item.title}
            </Text>
          </>
        )}
      ></RadioSelect>
    </Layout.Vertical>
  )
}

export default StepOne
