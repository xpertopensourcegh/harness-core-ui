import React, { useState } from 'react'
import { RadioSelect, Text, Layout, Icon, IconName } from '@wings-software/uikit'

import { Views } from '../Constants'

import i18n from '../ProjectsPage.i18n'
import css from './Steps.module.scss'

interface ProjectType {
  title: string
  icon: IconName
  view: Views
}

const options: ProjectType[] = [
  {
    title: i18n.newProjectWizard.createProject.newProject,
    icon: 'document',
    view: Views.CREATE
  },
  {
    title: i18n.newProjectWizard.createProject.cloneProject,
    icon: 'duplicate',
    view: Views.CLONE
  },
  {
    title: i18n.newProjectWizard.createProject.gitSync,
    icon: 'git-merge',
    view: Views.GITSYNC
  }
]

interface CreateProjectProps {
  setView: (view: Views) => void
}

const CreateProject: React.FC<CreateProjectProps> = ({ setView }) => {
  const [selected, setSelected] = useState<ProjectType>()

  return (
    <Layout.Vertical spacing="large" style={{ padding: '220px 150px 130px' }}>
      <Text font="large" style={{ color: 'var(--white)' }}>
        {i18n.newProjectWizard.createProject.name.toUpperCase()}
      </Text>
      <Text font="small" style={{ color: 'var(--white)' }}>
        {i18n.newProjectWizard.createProject.recommended.toUpperCase()}
      </Text>
      <RadioSelect<ProjectType>
        selected={selected}
        onChange={value => {
          setSelected(value)
          setView(value.view)
        }}
        className={css.radioSelect}
        data={options}
        renderItem={item => (
          <>
            <Icon name={item.icon} size={20} />
            <Text
              font={{ size: 'small' }}
              style={{
                color: selected ? 'var(--blue-800)' : 'parent',
                textTransform: 'uppercase',
                width: '100px',
                paddingTop: '40px'
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

export default CreateProject
