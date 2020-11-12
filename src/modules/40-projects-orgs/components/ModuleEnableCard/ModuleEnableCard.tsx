import React from 'react'
import { Card, Color, Icon, Layout, Text } from '@wings-software/uikit'
import { useHistory, useParams } from 'react-router-dom'
import i18n from '@projects-orgs/pages/projects/ProjectsPage.i18n'
import { getModuleDescription, getModuleIcon, getModulePurpose } from '@projects-orgs/utils/utils'
import { ModuleName } from 'framework/exports'
import { routeCDDashboard } from 'navigation/cd/routes'
import { routeCVMainDashBoardPage } from 'navigation/cv/routes'
import { usePutProject, Project } from 'services/cd-ng'
import { routeCIDashboard } from 'navigation/ci/routes'
import { routeCFDashboard } from 'navigation/cf/routes'
import { useToaster } from '@common/exports'
import css from './ModuleEnableCard.module.scss'

interface ModuleEnableCardProps {
  data: Project
  module: ModuleName
}

const ModuleEnableCard: React.FC<ModuleEnableCardProps> = ({ data, module }) => {
  const { accountId } = useParams()
  const history = useHistory()
  const { showSuccess, showError } = useToaster()

  const { mutate: updateProject } = usePutProject({
    identifier: '',
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: ''
    }
  })
  const onSelect = async (): Promise<void> => {
    data.modules?.push(module as Required<Project>['modules'][number])
    try {
      await updateProject(data, {
        pathParams: {
          identifier: data.identifier
        },
        queryParams: {
          accountIdentifier: accountId,
          orgIdentifier: data.orgIdentifier
        }
      })
      if (module === ModuleName.CD) {
        history.push(
          routeCDDashboard.url({
            orgIdentifier: data.orgIdentifier,
            projectIdentifier: data.identifier
          })
        )
      }
      if (module === ModuleName.CV) {
        history.push(
          routeCVMainDashBoardPage.url({
            orgIdentifier: data.orgIdentifier,
            projectIdentifier: data.identifier
          })
        )
      }
      if (module === ModuleName.CI) {
        history.push(
          routeCIDashboard.url({
            orgIdentifier: data.orgIdentifier,
            projectIdentifier: data.identifier
          })
        )
      }
      if (module === ModuleName.CF) {
        history.push(
          routeCFDashboard.url({
            orgIdentifier: data.orgIdentifier,
            projectIdentifier: data.identifier
          })
        )
      }
      showSuccess(i18n.moduleSuccess)
    } catch (e) {
      /* istanbul ignore next */
      showError(e.data.message)
    }
  }

  return (
    <Card elevation={0} className={css.card} onClick={onSelect}>
      <Layout.Horizontal spacing="small">
        <Icon name={getModuleIcon(module)} size={30} />
        <div>
          <Text font="small">{i18n.newProjectWizard.purposeList.continuous}</Text>
          <Text font={{ size: 'medium' }} padding={{ bottom: 'xxlarge' }} color={Color.BLACK}>
            {getModulePurpose(module)}
          </Text>
        </div>
      </Layout.Horizontal>

      <Text font="small" padding={{ bottom: 'xxlarge' }} className={css.description}>
        {getModuleDescription(module)}
      </Text>
      <Layout.Horizontal spacing="large">
        <Text font="small" className={css.time}>
          {i18n.newProjectWizard.purposeList.time}
        </Text>
        <Text font="small" color={Color.BLUE_600} className={css.trial}>
          {i18n.newProjectWizard.purposeList.starttrial}
        </Text>
      </Layout.Horizontal>
    </Card>
  )
}

export default ModuleEnableCard
