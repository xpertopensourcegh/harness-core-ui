import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Container, Layout, SimpleTagInput, Text, TextInput, useToggle } from '@wings-software/uicore'
import routes from '@common/RouteDefinitions'
import {
  SectionContainer,
  SectionContainerTitle,
  SectionLabelValuePair
} from '@delegates/components/SectionContainer/SectionContainer'
import { useStrings } from 'framework/exports'
import { DelegateProfile, useGetDelegateConfigFromId } from 'services/portal'
import { PageError } from '@common/components/Page/PageError'
import { TagsViewer } from '@common/components/TagsViewer/TagsViewer'
import { ContainerSpinner } from '@common/components/ContainerSpinner/ContainerSpinner'
import { DetailPageTemplate } from '../../components/DetailPageTemplate/DetailPageTemplate'
import css from './DelegateConfigurationDetailPage.module.scss'

const fullSizeContentStyle: React.CSSProperties = {
  position: 'fixed',
  top: '135px',
  left: '270px',
  width: 'calc(100% - 270px)',
  height: 'calc(100% - 135px)'
}

export default function DelegateProfileDetails(): JSX.Element {
  const { getString } = useStrings()
  const { delegateConfigId, accountId } = useParams<Record<string, string>>()
  const { data, loading, refetch, error } = useGetDelegateConfigFromId({
    delegateProfileId: delegateConfigId,
    queryParams: { accountId }
  })
  const profile = data?.resource
  const breadcrumbs = [
    {
      title: getString('resources'),
      url: routes.toResources({
        accountId
      })
    },
    {
      title: getString('delegate.delegates'),
      url: routes.toResourcesDelegates({
        accountId
      })
    },
    {
      title: getString('delegate.delegatesConfigurations'),
      url:
        routes.toResourcesDelegates({
          accountId
        }) + '?tab=configuration'
    }
  ]
  const [editMode, toggleEditMode] = useToggle(false)
  const [formData, setFormData] = useState<DelegateProfile>()

  useEffect(() => {
    if (profile) {
      setFormData(profile)
    }
  }, [profile])

  // console.table(formData)

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
      headerExtras={
        <Button
          icon={editMode ? 'floppy-disk' : 'edit'}
          text={editMode ? getString('save') : getString('edit')}
          style={{
            position: 'absolute',
            top: '50px',
            right: '50px',
            color: 'var(--blue-500)',
            borderColor: 'var(--blue-500)'
          }}
          onClick={() => toggleEditMode()}
        />
      }
    >
      <Container padding="xxlarge">
        <Layout.Horizontal spacing="large">
          <Layout.Vertical spacing="large" width={400}>
            <SectionContainer>
              <SectionContainerTitle>{getString('overview')}</SectionContainerTitle>
              <SectionLabelValuePair
                label={getString('delegate.CONFIGURATION_NAME')}
                value={
                  editMode ? (
                    <TextInput
                      autoFocus
                      defaultValue={profile?.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFormData({ ...formData, name: e.target.value } as DelegateProfile)
                      }}
                    />
                  ) : (
                    profile?.name
                  )
                }
              />
              {!editMode && profile?.description && (
                <SectionLabelValuePair label={getString('description')} value={profile?.description} />
              )}
              {editMode && (
                <SectionLabelValuePair
                  label={getString('description')}
                  value={
                    <TextInput
                      defaultValue={profile?.description}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFormData({ ...formData, description: e.target.value } as DelegateProfile)
                      }}
                    />
                  }
                />
              )}
              {/** TODO: Identifier is not yet supported */}
              <SectionLabelValuePair
                label={getString('identifier')}
                value={editMode ? <TextInput disabled defaultValue={profile?.uuid} /> : profile?.uuid}
              />{' '}
              {!editMode && profile?.selectors && (
                <SectionLabelValuePair label={getString('tagsLabel')} value={profile?.selectors} />
              )}
              {editMode && (
                <SectionLabelValuePair
                  label={getString('tagsLabel')}
                  value={
                    <SimpleTagInput
                      fill
                      openOnKeyDown={false}
                      showClearAllButton
                      showNewlyCreatedItemsInList={false}
                      allowNewTag
                      placeholder="Enter tags..."
                      selectedItems={['10488', '10489', '${service.name}']}
                      validateNewTag={tag => {
                        // Allow valid Harness expression
                        const isValidTag = tag.startsWith('${') && tag.endsWith('}')
                        if (!isValidTag) {
                          alert('Tag is not allowed')
                        }
                        return isValidTag
                      }}
                      items={[
                        {
                          label: 'perpetual-tasks',
                          value: '10488'
                        },
                        {
                          label: 'test-framework',
                          value: '10489'
                        },
                        {
                          label: 'watcher',
                          value: '10501'
                        }
                      ]}
                      // onChange={(selectedItems, createdItems, items) => {
                      //   console.log('onChange', { selectedItems, createdItems, items })
                      // }}
                    />
                  }
                />
              )}
            </SectionContainer>

            <SectionContainer>
              <SectionContainerTitle>{getString('delegate.Scope')}</SectionContainerTitle>
              <Text style={{ fontSize: '14px', color: '#22272D', lineHeight: '24px', fontWeight: 500 }}>
                {getString('delegate.ScopeDescription')}
              </Text>

              <SectionLabelValuePair
                label={getString('delegate.envTypes')}
                value={
                  editMode ? (
                    <SimpleTagInput
                      fill
                      showClearAllButton
                      placeholder="Select environment types..."
                      selectedItems={['Production']}
                      items={[
                        {
                          label: 'Production',
                          value: 'Production'
                        },
                        {
                          label: 'Non-Production',
                          value: 'Non-Production'
                        }
                      ]}
                      // onChange={(selectedItems, createdItems, items) => {
                      //   console.log('onChange', { selectedItems, createdItems, items })
                      // }}
                    />
                  ) : (
                    <TagsViewer tags={['prod', 'non-prod']} />
                  )
                }
              />

              <SectionLabelValuePair
                label={getString('environments')}
                value={
                  editMode ? (
                    <SimpleTagInput
                      fill
                      showClearAllButton
                      placeholder="Select environment types..."
                      selectedItems={['k8s-prod-app1', 'k8s-prod-app2']}
                      items={[
                        {
                          label: 'k8s-prod-app1',
                          value: 'k8s-prod-app1'
                        },
                        {
                          label: 'k8s-prod-app2',
                          value: 'k8s-prod-app2'
                        },
                        {
                          label: 'k8s-prod-app3',
                          value: 'k8s-prod-app3'
                        },
                        {
                          label: 'k8s-prod-app4',
                          value: 'k8s-prod-app4'
                        }
                      ]}
                      // onChange={(selectedItems, createdItems, items) => {
                      //   console.log('onChange', { selectedItems, createdItems, items })
                      // }}
                    />
                  ) : (
                    <TagsViewer tags={['k8s-prod-app1', 'k8s-prod-app2']} />
                  )
                }
              />
            </SectionContainer>
          </Layout.Vertical>
          <SectionContainer width={550}>
            <SectionContainerTitle>{getString('delegate.Init_Script')}</SectionContainerTitle>

            <textarea
              placeholder="Enter initialization script..."
              className={css.codeEditor}
              {...(editMode ? undefined : { disabled: true })}
              value={profile?.startupScript || ''}
            />
          </SectionContainer>
        </Layout.Horizontal>
      </Container>
    </DetailPageTemplate>
  )
}
