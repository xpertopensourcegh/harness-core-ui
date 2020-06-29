import React from 'react'
import { Icon, Layout, Text, Button } from '@wings-software/uikit'

import type { StepThreeData } from '../StepThree'

import i18n from '../../../../pages/ProjectsPage/ProjectsPage.i18n'

import css from './EmailPreview.module.scss'

interface EmailPreviewProps {
  data: StepThreeData
}

const EmailPreview: React.FC<EmailPreviewProps> = ({ data }) => {
  return (
    <div className={css.card}>
      <header>
        <Icon name="harness" size={32} />
      </header>
      <section>
        <Layout.Vertical spacing="large">
          <Text>{i18n.newProjectWizard.stepThree.emailHello}</Text>
          <Text>{i18n.newProjectWizard.stepThree.emailInvite}</Text>
          {data?.invitationMessage ? <Text>{data.invitationMessage}</Text> : null}
          <Button intent="primary" text="View Project" />
          <Text>
            {i18n.newProjectWizard.stepThree.emailThankyou}
            {/* TODO: replace with username once API is integrated */}
            Olivia Dunham
          </Text>
        </Layout.Vertical>
      </section>
      <footer>{i18n.newProjectWizard.stepThree.emailFooter}</footer>
    </div>
  )
}

export default EmailPreview
