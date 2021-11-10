import React from 'react'
import { useParams } from 'react-router-dom'
import { TabNavigation } from '@wings-software/uicore'
import { NGBreadcrumbs } from '@common/components/NGBreadcrumbs/NGBreadcrumbs'
import { Page } from '@common/exports'
import ScopedTitle from '@common/components/Title/ScopedTitle'
import { Scope } from '@common/interfaces/SecretsInterface'
import routes from '@common/RouteDefinitions'
import type { ProjectPathProps, PipelineType } from '@common/interfaces/RouteInterfaces'
import { useStrings } from 'framework/strings'

const DelegatesPage: React.FC = ({ children }) => {
  const params = useParams<PipelineType<ProjectPathProps>>()
  const { accountId, orgIdentifier, projectIdentifier, module } = params
  const { getString } = useStrings()

  return (
    <>
      <Page.Header
        breadcrumbs={<NGBreadcrumbs />}
        title={
          <ScopedTitle
            title={{
              [Scope.PROJECT]: getString('delegate.delegates'),
              [Scope.ORG]: getString('delegates.delegatesTitle'),
              [Scope.ACCOUNT]: getString('delegates.delegatesTitle')
            }}
          />
        }
        toolbar={
          <TabNavigation
            size={'small'}
            links={[
              {
                label: getString('delegate.delegates'),
                to: routes.toDelegateList({ accountId, orgIdentifier, projectIdentifier, module })
              },
              {
                label: getString('delegate.delegateConfigurations'),
                to: routes.toDelegateConfigs({ accountId, orgIdentifier, projectIdentifier, module })
              }
            ]}
          />
        }
      />
      <Page.Body>{children}</Page.Body>
    </>
  )
}

export default DelegatesPage
