import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { get } from 'lodash-es'
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
import { fullSizeContentStyle, EnvironmentType } from '@delegates/constants'
import { ContainerSpinner } from '@common/components/ContainerSpinner/ContainerSpinner'
import { DelegateTab } from './utils/DelegateHelper'
import { DetailPageTemplate } from '../../components/DetailPageTemplate/DetailPageTemplate'
import css from './DelegateConfigurationDetailPage.module.scss'

// TODO: This field needs to be supported by profile API
// Place-holder for now until backend supports it
const ENVIRONMENT_TYPE_FIELD = 'environmentTypes'

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
        }) + `?tab=${DelegateTab.CONFIGURATIONS}`
    }
  ]
  const [editMode, toggleEditMode] = useToggle(false)
  const [formData, setFormData] = useState<DelegateProfile>({} as DelegateProfile)
  const LABEL_PROD = getString('production')
  const LABEL_NON_PROD = getString('nonProduction')
  const environmentTags: string[] = useMemo(() => {
    const types: string[] = get(formData, ENVIRONMENT_TYPE_FIELD, [])
    return types.map(type => {
      if (type === EnvironmentType.PROD) {
        return LABEL_PROD
      }
      return LABEL_NON_PROD
    })
  }, [formData, LABEL_PROD, LABEL_NON_PROD])
  const toggleEditModeOrSave = useCallback(() => {
    if (!editMode) {
      toggleEditMode()
    } else {
      // TODO: Note to Sahithi: Implement data validation and saving
      // 1. Loop through formData and validate (right now I think only name is required)
      // 2. Show spinner and save
      // 3. Show error if the request is not successful
      // 4. toggle back to view mode if it's successful
    }
  }, [editMode, toggleEditMode])

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
          onClick={() => toggleEditModeOrSave()}
        />
      }
    >
      <Container padding="xxlarge">
        <Layout.Horizontal spacing="large">
          <Layout.Vertical spacing="large" width={400}>
            <SectionContainer>
              <SectionContainerTitle>{getString('overview')}</SectionContainerTitle>

              {/* Name */}
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

              {/* Description */}
              {!editMode && profile?.description && (
                <SectionLabelValuePair label={getString('description')} value={formData.description} />
              )}
              {editMode && (
                <SectionLabelValuePair
                  label={getString('description')}
                  value={
                    <TextInput
                      defaultValue={formData.description}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFormData({ ...formData, description: e.target.value } as DelegateProfile)
                      }}
                    />
                  }
                />
              )}

              {/* Identifier */}
              <SectionLabelValuePair
                label={getString('identifier')}
                value={
                  editMode ? (
                    <TextInput disabled defaultValue={get(profile, 'identifier') || profile?.uuid} />
                  ) : (
                    get(profile, 'identifier') || profile?.uuid
                  )
                }
              />

              {/* Tags */}
              {!editMode && profile?.selectors && (
                <SectionLabelValuePair
                  label={getString('tagsLabel')}
                  value={<TagsViewer tags={formData.selectors || []} />}
                />
              )}
              {editMode && (
                <SectionLabelValuePair
                  label={getString('tagsLabel')}
                  value={
                    <SimpleTagInput
                      fill
                      openOnKeyDown={false}
                      showClearAllButton
                      showNewlyCreatedItemsInList={true}
                      allowNewTag
                      placeholder={getString('delegate.enterTags')}
                      selectedItems={formData.selectors || []}
                      validateNewTag={tag => {
                        return !!tag // TODO: Note to Sahithi: Copy the logic from wingsui to check  for new profile tag
                      }}
                      items={formData.selectors || []}
                      onChange={(selectedItems, _createdItems, _items) => {
                        setFormData({ ...formData, selectors: selectedItems as string[] })
                      }}
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

              {/* TODO: EnvironmentTypes, still needs backend support */}
              <SectionLabelValuePair
                label={getString('delegate.envTypes')}
                value={
                  editMode ? (
                    <SimpleTagInput
                      fill
                      showClearAllButton
                      placeholder={getString('delegate.selectEnvType')}
                      selectedItems={environmentTags}
                      items={[LABEL_PROD, LABEL_NON_PROD]}
                      onChange={(selectedItems, _createdItems, _items) => {
                        setFormData({
                          ...formData,
                          [ENVIRONMENT_TYPE_FIELD]: selectedItems.map(item =>
                            item === LABEL_PROD ? EnvironmentType.PROD : EnvironmentType.NON_PROD
                          )
                        } as DelegateProfile)
                      }}
                    />
                  ) : (
                    <TagsViewer tags={environmentTags} />
                  )
                }
              />

              {/* TODO: Environments, needs backend support */}
              <SectionLabelValuePair
                label={getString('environments')}
                value={
                  editMode ? (
                    <SimpleTagInput
                      fill
                      showClearAllButton
                      placeholder={getString('delegate.selectEnvs')}
                      selectedItems={[]}
                      items={[]}
                      // onChange={(selectedItems, createdItems, items) => {
                      //   console.log('onChange', { selectedItems, createdItems, items })
                      // }}
                    />
                  ) : (
                    <TagsViewer tags={[]} />
                  )
                }
              />
            </SectionContainer>
          </Layout.Vertical>
          <SectionContainer width={550}>
            <SectionContainerTitle>{getString('delegate.Init_Script')}</SectionContainerTitle>

            <textarea
              placeholder={editMode ? getString('delegate.initScriptPlaceholder') : undefined}
              className={css.codeEditor}
              {...(editMode ? undefined : { disabled: true })}
              value={formData?.startupScript || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setFormData({ ...formData, startupScript: e.target.value } as DelegateProfile)
              }}
            />
          </SectionContainer>
        </Layout.Horizontal>
      </Container>
    </DetailPageTemplate>
  )
}
