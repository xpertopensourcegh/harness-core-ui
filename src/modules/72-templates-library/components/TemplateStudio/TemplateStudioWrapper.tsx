import React from 'react'
import { useParams } from 'react-router-dom'
import { TemplateStudio } from '@templates-library/components/TemplateStudio/TemplateStudio'
import { TemplateProvider } from '@templates-library/components/TemplateStudio/TemplateContext/TemplateContext'
import type {
  ModulePathParams,
  TemplateStudioPathProps,
  TemplateStudioQueryParams
} from '@common/interfaces/RouteInterfaces'
import { useQueryParams } from '@common/hooks'

export const TemplateStudioWrapper: React.FC = (): JSX.Element => {
  const { accountId, projectIdentifier, orgIdentifier, templateIdentifier } = useParams<
    TemplateStudioPathProps & ModulePathParams
  >()
  const { versionLabel } = useQueryParams<TemplateStudioQueryParams>()
  return (
    <TemplateProvider
      queryParams={{ accountIdentifier: accountId, orgIdentifier, projectIdentifier }}
      templateIdentifier={templateIdentifier}
      versionLabel={versionLabel}
    >
      <TemplateStudio />
    </TemplateProvider>
  )
}
