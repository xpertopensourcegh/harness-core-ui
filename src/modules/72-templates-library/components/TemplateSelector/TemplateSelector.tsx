import React, { useEffect, useState } from 'react'
import {
  Button,
  ButtonSize,
  ButtonVariation,
  Color,
  Container,
  DropDown,
  ExpandingSearchInput,
  GridListToggle,
  Icon,
  Layout,
  SelectOption,
  Text,
  Views
} from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import { noop } from 'lodash-es'
import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import type { ModulePathParams, ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { TemplateSummaryResponse, useGetTemplateList } from 'services/template-ng'
import type { TemplateType } from '@templates-library/utils/templatesUtils'
import { useStrings } from 'framework/strings'
import templateIllustration from '@templates-library/pages/TemplatesPage/images/templates-illustration.svg'
import { PageSpinner } from '@common/components'
import { PageError } from '@common/components/Page/PageError'
import { useMutateAsGet } from '@common/hooks'
import { TemplateListType } from '@templates-library/pages/TemplatesPage/TemplatesPageUtils'
import TemplatesView from '@templates-library/pages/TemplatesPage/views/TemplatesView'
import { TemplateDetails } from '../TemplateDetails/TemplateDetails'
import css from './TemplateSelector.module.scss'

export interface TemplateSelectorProps {
  templateTypes: (keyof typeof TemplateType)[]
  childTypes: string[]
  onSelect: (template: any) => void
  onClose: () => void
  onUseTemplate: (template: TemplateSummaryResponse) => void
}

const levelOptions: SelectOption[] = [
  {
    value: 'account',
    label: 'Account'
  },
  {
    value: 'org',
    label: 'Organization'
  },
  {
    value: 'project',
    label: 'Project'
  }
]

export const TemplateSelector: React.FC<TemplateSelectorProps> = (props): JSX.Element => {
  const { templateTypes, childTypes, onUseTemplate } = props
  const [selectedLevel, setSelectedLevel] = useState(levelOptions[0])
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateSummaryResponse | undefined>()
  const { getString } = useStrings()
  const [page, setPage] = useState(0)
  const [view, setView] = useState<Views>(Views.GRID)
  const [searchParam, setSearchParam] = useState('')
  const { projectIdentifier, orgIdentifier, accountId, module } = useParams<ProjectPathProps & ModulePathParams>()

  const {
    data: templateData,
    refetch: reloadTemplates,
    loading,
    error
  } = useMutateAsGet(useGetTemplateList, {
    body: {
      filterType: 'Template',
      templateEntityTypes: templateTypes,
      childTypes: childTypes
    },
    queryParams: {
      accountIdentifier: accountId,
      projectIdentifier,
      module,
      orgIdentifier,
      templateListType: TemplateListType.LastUpdated,
      searchTerm: searchParam,
      page,
      size: 20
    },
    queryParamStringifyOptions: { arrayFormat: 'comma' }
  })

  useEffect(() => {
    reloadTemplates()
  }, [page, accountId, projectIdentifier, orgIdentifier, module, searchParam])

  const reset = (): void => {
    setSearchParam('')
  }

  return (
    <Container height={'100%'}>
      <Layout.Horizontal height={'100%'}>
        <Container width={735} background={Color.FORM_BG} className={css.selectorContainer}>
          <Layout.Vertical spacing={'xxlarge'} height={'100%'}>
            <Container>
              <Layout.Vertical spacing={'small'}>
                <Breadcrumbs
                  links={[
                    {
                      url: '/',
                      label: 'Templates'
                    },
                    {
                      url: '/',
                      label: 'Step Templates'
                    }
                  ]}
                />
                <Container>
                  <Layout.Horizontal spacing={'small'}>
                    <DropDown
                      items={levelOptions}
                      value={selectedLevel.value.toString()}
                      onChange={item => setSelectedLevel(item)}
                      filterable={false}
                    />
                    <ExpandingSearchInput
                      className={css.searchBox}
                      alwaysExpanded={true}
                      onChange={(text: string) => {
                        setPage(0)
                        setSearchParam(text)
                      }}
                    />
                  </Layout.Horizontal>
                </Container>
              </Layout.Vertical>
            </Container>
            <Container style={{ flexGrow: 1, position: 'relative' }}>
              {loading && <PageSpinner />}
              {!loading && error && <PageError message={error?.message} onClick={reloadTemplates} />}
              {!templateData?.data?.content?.length && (
                <Layout.Vertical height={'100%'} spacing={'xlarge'} flex={{ align: 'center-center' }}>
                  {searchParam ? (
                    <>
                      <Icon color={Color.GREY_400} name="template-library" size={50} />
                      <Text font={{ weight: 'bold', size: 'medium' }} color={Color.GREY_400}>
                        {getString('common.filters.noMatchingFilterData')}
                      </Text>
                      <Button
                        variation={ButtonVariation.LINK}
                        size={ButtonSize.LARGE}
                        onClick={reset}
                        text={getString('common.filters.clearFilters')}
                      />
                    </>
                  ) : (
                    <>
                      <img src={templateIllustration} className={css.illustration} />
                      <Text font={{ size: 'large', weight: 'bold' }} color={Color.GREY_300}>
                        {getString('templatesLibrary.templatesPage.noTemplates')}
                      </Text>
                    </>
                  )}
                </Layout.Vertical>
              )}
              {!!templateData?.data?.content?.length && (
                <Layout.Vertical height={'100%'}>
                  <Container>
                    <Layout.Horizontal flex={{ alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text font={{ size: 'xsmall', weight: 'bold' }} color={Color.GREY_800}>
                        {getString('common.templates').toUpperCase()} ({templateData?.data?.totalElements})
                      </Text>
                      <GridListToggle initialSelectedView={Views.GRID} onViewToggle={setView} />
                    </Layout.Horizontal>
                  </Container>
                  <Container style={{ flexGrow: 1 }}>
                    <TemplatesView
                      data={templateData?.data}
                      gotoPage={setPage}
                      onSelect={setSelectedTemplate}
                      selectedIdentifier={selectedTemplate?.identifier}
                      view={view}
                    />
                  </Container>
                </Layout.Vertical>
              )}
            </Container>
          </Layout.Vertical>
        </Container>
        <Container className={css.preview} background={Color.FORM_BG}>
          {selectedTemplate ? (
            <Layout.Vertical height={'100%'}>
              <TemplateDetails
                setTemplate={setSelectedTemplate}
                templateIdentifier={selectedTemplate.identifier || ''}
              />
              <Container>
                <Layout.Horizontal
                  padding={{ right: 'xxlarge', bottom: 'xxxlarge', left: 'xxlarge' }}
                  spacing={'small'}
                >
                  <Button
                    variation={ButtonVariation.PRIMARY}
                    text={getString('templatesLibrary.useTemplate')}
                    onClick={() => {
                      onUseTemplate?.(selectedTemplate)
                    }}
                  />
                  <Button
                    variation={ButtonVariation.LINK}
                    disabled
                    text={getString('templatesLibrary.copyToPipeline')}
                    onClick={noop}
                  />
                </Layout.Horizontal>
              </Container>
            </Layout.Vertical>
          ) : (
            <Container padding={'xlarge'} height={'100%'}>
              <Layout.Vertical className={css.empty} height={'100%'} flex={{ align: 'center-center' }}>
                <Text font={{ size: 'small', italic: true }} color={Color.GREY_300}>
                  {getString('templatesLibrary.selectTemplateToPreview')}
                </Text>
              </Layout.Vertical>
            </Container>
          )}
        </Container>
      </Layout.Horizontal>
    </Container>
  )
}
