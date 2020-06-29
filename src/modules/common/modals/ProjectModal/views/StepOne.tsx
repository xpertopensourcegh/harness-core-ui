import React, { useState } from 'react'
import { StepProps, RadioSelect, Button, Layout, Text, IconName, Color } from '@wings-software/uikit'

import type { ProjectDTO } from 'services/cd-ng'

import i18n from '../../../pages/ProjectsPage/ProjectsPage.i18n'
import css from './Steps.module.scss'

interface Purpose {
  icon: IconName
  titleOne: string
  titleTwo: string
  description: string
  time: string
  value: string
}

const options: Purpose[] = [
  {
    icon: 'nav-project',
    titleOne: i18n.newProjectWizard.stepOne.continuous.toUpperCase(),
    titleTwo: i18n.newProjectWizard.stepOne.deployment.toUpperCase(),
    description: i18n.newProjectWizard.stepOne.cdDescription,
    time: i18n.newProjectWizard.stepOne.time(10),
    value: 'CD'
  },
  {
    icon: 'nav-project',
    titleOne: i18n.newProjectWizard.stepOne.continuous.toUpperCase(),
    titleTwo: i18n.newProjectWizard.stepOne.verification.toUpperCase(),
    description: i18n.newProjectWizard.stepOne.cvDescription,
    time: i18n.newProjectWizard.stepOne.time(10),
    value: 'CV'
  }
]

const StepOne: React.FC<StepProps<ProjectDTO>> = ({ nextStep, prevStepData }) => {
  const [selected, setSelected] = useState<Purpose>(options[0])
  return (
    <>
      <Text font="medium" padding={{ bottom: 'xxlarge' }}>
        {i18n.newProjectWizard.stepOne.name.toUpperCase()}
      </Text>
      <RadioSelect<Purpose>
        selected={selected}
        onChange={setSelected}
        className={css.radioSelectPurpose}
        data={options}
        renderItem={item => (
          <>
            <Text>{item.titleOne}</Text>
            <Text font="medium" color="black">
              {item.titleTwo}
            </Text>
            <Text padding={{ top: 'medium', bottom: 'large' }} height={90}>
              {item.description}
            </Text>
            <Text icon="time" padding={{ top: 'medium' }} color={Color.GREY_400} style={{ justifyContent: 'left' }}>
              {item.time}
            </Text>
          </>
        )}
      />
      <Layout.Horizontal spacing="small" padding={{ top: 'xxlarge' }}>
        <Button
          onClick={() => nextStep?.({ ...prevStepData, purpose: selected.value })}
          style={{ color: 'var(--blue-500)' }}
          text={i18n.newProjectWizard.next}
        />
      </Layout.Horizontal>
    </>
  )
}

export default StepOne
