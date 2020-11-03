import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Color, Layout, Icon, Text } from '@wings-software/uikit'
import { routeCDDashboard } from 'navigation/cd/routes'
import { routeCVMainDashBoardPage } from 'navigation/cv/routes'
import { Project, usePutProject } from 'services/cd-ng'
import { ModuleName } from 'framework/exports'
import i18n from './ModuleRenderer.i18n'
import css from './ModuleRenderer.module.scss'

interface DefaultProps {
  data: Project
  isPreview?: boolean
}

const DefaultRenderer: React.FC<DefaultProps> = props => {
  const { data, isPreview } = props
  const { accountId } = useParams()
  const history = useHistory()
  const { mutate: updateProject } = usePutProject({
    identifier: '',
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: ''
    }
  })

  const onSelect = async (module: Required<Project>['modules'][number]): Promise<boolean> => {
    const dataToSubmit: Project = {
      ...data,
      modules: [module]
    }
    try {
      await updateProject(dataToSubmit, {
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
            orgIdentifier: data.orgIdentifier as string,
            projectIdentifier: data.identifier || ''
          })
        )
      }
      if (module === ModuleName.CV) {
        history.push(
          routeCVMainDashBoardPage.url({
            orgIdentifier: data.orgIdentifier as string,
            projectIdentifier: data.identifier || ''
          })
        )
      }
      return true
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  }
  return (
    <Layout.Vertical
      padding={{ top: 'medium', left: 'xlarge', right: 'xlarge', bottom: 'large' }}
      border={{ top: true, bottom: true, color: Color.GREY_250 }}
      className={css.started}
    >
      <Text font="small" color={Color.BLACK} padding={{ bottom: 'xsmall' }}>
        {i18n.start}
      </Text>
      {isPreview ? (
        <Layout.Horizontal spacing="small">
          <Icon name="cd-main" size={20} />
          <Icon name="cv-main" size={20} />
          <Icon name="ce-main" size={20} />
          <Icon name="cf-main" size={20} />
          <Icon name="ci-main" size={20} />
        </Layout.Horizontal>
      ) : (
        <Layout.Horizontal spacing="small">
          <Icon
            name="cd-main"
            size={20}
            onClick={() => {
              onSelect(ModuleName.CD)
            }}
            className={css.pointer}
          />

          <Icon
            name="cv-main"
            size={20}
            onClick={() => {
              onSelect(ModuleName.CV)
            }}
            className={css.pointer}
          />
          <Icon
            name="ce-main"
            size={20}
            onClick={() => {
              onSelect(ModuleName.CE)
            }}
            className={css.pointer}
          />
          <Icon
            name="cf-main"
            size={20}
            onClick={() => {
              onSelect(ModuleName.CF)
            }}
            className={css.pointer}
          />
          <Icon
            name="ci-main"
            size={20}
            onClick={() => {
              onSelect(ModuleName.CI)
            }}
            className={css.pointer}
          />
        </Layout.Horizontal>
      )}
    </Layout.Vertical>
  )
}

export default DefaultRenderer
