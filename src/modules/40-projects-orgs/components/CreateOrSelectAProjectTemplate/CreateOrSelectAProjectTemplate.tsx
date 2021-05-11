import React from 'react'
import { Text, Layout, Color, Button } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'

interface CreateOrSelectAProjectTemplateProps {
  onSelectProject: () => void
  onCreateProject: () => void
  moduleDescription: string
}

export const CreateOrSelectAProjectTemplate: React.FC<CreateOrSelectAProjectTemplateProps> = ({
  onSelectProject,
  onCreateProject,
  moduleDescription
}) => {
  const { getString } = useStrings()

  return (
    <Layout.Vertical spacing="small">
      <Text style={{ color: Color.BLACK, fontSize: 'large', fontWeight: 'bold' }}>
        {getString('projectsOrgs.createOrSelectAProject')}
      </Text>
      <Text style={{ color: Color.BLACK, fontSize: 'small' }}>
        {getString('projectsOrgs.getStarted', { moduleDescription })}
      </Text>
      <Layout.Vertical spacing="small" padding={{ top: 'large' }}>
        <Button
          intent="primary"
          text={getString('projectsOrgs.selectAnExistingProject')}
          onClick={onSelectProject}
          width="60%"
        />
        <Button
          intent="none"
          text={getString('projectsOrgs.createANewProject')}
          onClick={onCreateProject}
          width="60%"
        />
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
