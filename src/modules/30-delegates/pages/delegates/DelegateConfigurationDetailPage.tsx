import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Layout, PageError } from '@wings-software/uicore'
import routes from '@common/RouteDefinitions'
import {
  SectionContainer,
  SectionContainerTitle,
  SectionLabelValuePair
} from '@delegates/components/SectionContainer/SectionContainer'
import { useStrings } from 'framework/strings'
import type {
  DelegateConfigProps,
  ProjectPathProps,
  ModulePathParams,
  AccountPathProps
} from '@common/interfaces/RouteInterfaces'
import { useGetDelegateConfigNgV2, DelegateProfileDetailsNg } from 'services/cd-ng'
import { TagsViewer } from '@common/components/TagsViewer/TagsViewer'
import { fullSizeContentStyle } from '@delegates/constants'
import { ContainerSpinner } from '@common/components/ContainerSpinner/ContainerSpinner'
import { DetailPageTemplate } from '../../components/DetailPageTemplate/DetailPageTemplate'
import css from './DelegateConfigurationDetailPage.module.scss'

export default function DelegateProfileDetails(): JSX.Element {
  const { getString } = useStrings()
  const { delegateConfigIdentifier, accountId, orgIdentifier, projectIdentifier, module } = useParams<
    Partial<ProjectPathProps & ModulePathParams> & AccountPathProps & DelegateConfigProps
  >()
  const { data, loading, refetch, error } = useGetDelegateConfigNgV2({
    accountId,
    delegateConfigIdentifier,
    queryParams: { orgId: orgIdentifier, projectId: projectIdentifier }
  })

  const profile = data?.resource
  const breadcrumbs = [
    {
      label: getString('delegate.delegates'),
      url: routes.toDelegateList({
        accountId,
        orgIdentifier,
        projectIdentifier,
        module
      })
    },
    {
      label: getString('delegate.delegatesConfigurations'),
      url: routes.toDelegateConfigs({
        accountId,
        orgIdentifier,
        projectIdentifier,
        module
      })
    }
  ]
  const [formData, setFormData] = useState<DelegateProfileDetailsNg>({} as DelegateProfileDetailsNg)

  useEffect(() => {
    if (profile) {
      setFormData(profile)
    }
  }, [profile])

  if (loading && !data) {
    return (
      <Container style={fullSizeContentStyle}>
        <ContainerSpinner />
      </Container>
    )
  }

  if (error) {
    return (
      <Container style={fullSizeContentStyle}>
        <PageError message={error.message} onClick={() => refetch()} />
      </Container>
    )
  }

  return (
    <DetailPageTemplate
      breadcrumbs={breadcrumbs}
      title={profile?.name as string}
      subTittle={profile?.description}
      tags={profile?.selectors}
    >
      <Container padding="xxlarge">
        <Layout.Horizontal spacing="large">
          <Layout.Vertical spacing="large" width={600}>
            <SectionContainer>
              <SectionContainerTitle>{getString('overview')}</SectionContainerTitle>

              {/* Name */}
              <SectionLabelValuePair
                dataTooltipId="delegateConfig_name"
                label={getString('delegate.CONFIGURATION_NAME')}
                value={profile?.name}
              />

              <SectionLabelValuePair
                dataTooltipId="delegateConfig_identifier"
                label={getString('delegates.delegateIdentifier')}
                value={profile?.identifier}
              />

              {/* Description */}
              {profile?.description && (
                <SectionLabelValuePair
                  dataTooltipId="delegateConfig_description"
                  label={getString('description')}
                  value={formData.description}
                />
              )}

              {/* Tags */}
              {profile?.selectors && (
                <SectionLabelValuePair
                  dataTooltipId="delegateConfig_tags"
                  label={getString('tagsLabel')}
                  value={<TagsViewer tags={formData.selectors || []} />}
                />
              )}
            </SectionContainer>
          </Layout.Vertical>
          <SectionContainer width={550}>
            <SectionContainerTitle>{getString('delegate.Init_Script')}</SectionContainerTitle>

            <textarea
              className={css.codeEditor}
              disabled={true}
              value={formData?.startupScript || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setFormData({ ...formData, startupScript: e.target.value } as DelegateProfileDetailsNg)
              }}
            />
          </SectionContainer>
        </Layout.Horizontal>
      </Container>
    </DetailPageTemplate>
  )
}
