import '@templates-library/components/PipelineSteps'
import React from 'react'
import { RouteWithLayout } from '@common/router'
import { AccountSideNavProps } from '@common/RouteDestinations'
import routes from '@common/RouteDefinitions'
import { accountPathProps, orgPathProps } from '@common/utils/routeUtils'
import TemplatesPage from '@templates-library/pages/TemplatesPage/TemplatesPage'
import { TemplateStudioWrapper } from '@templates-library/components/TemplateStudio/TemplateStudioWrapper'

export default (
  <>
    <RouteWithLayout sidebarProps={AccountSideNavProps} path={routes.toTemplates({ ...accountPathProps })} exact>
      <TemplatesPage />
    </RouteWithLayout>
    <RouteWithLayout
      sidebarProps={AccountSideNavProps}
      path={routes.toTemplateStudio({
        ...accountPathProps,
        ...{
          templateIdentifier: ':templateIdentifier',
          templateType: ':templateType(Step)'
        }
      })}
      exact
    >
      <TemplateStudioWrapper />
    </RouteWithLayout>
    <RouteWithLayout sidebarProps={AccountSideNavProps} path={routes.toTemplates({ ...orgPathProps })} exact>
      <TemplatesPage />
    </RouteWithLayout>
    <RouteWithLayout
      sidebarProps={AccountSideNavProps}
      path={routes.toTemplateStudio({
        ...orgPathProps,
        ...{
          templateIdentifier: ':templateIdentifier',
          templateType: ':templateType(Step)'
        }
      })}
      exact
    >
      <TemplateStudioWrapper />
    </RouteWithLayout>
  </>
)
