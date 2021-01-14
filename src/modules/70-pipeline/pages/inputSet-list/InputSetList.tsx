import React from 'react'
import { Popover, Button, Layout, TextInput, useModalHook } from '@wings-software/uicore'
import { Menu, MenuItem, Position } from '@blueprintjs/core'
import { useHistory, useParams } from 'react-router-dom'
import { Page } from '@common/exports'
import { useGetInputSetsListForPipeline } from 'services/pipeline-ng'
import { OverlayInputSetForm } from '@pipeline/components/OverlayInputSetForm/OverlayInputSetForm'
import routes from '@common/RouteDefinitions'
import type { PipelinePathProps, PipelineType } from '@common/interfaces/RouteInterfaces'
import { useDocumentTitle } from '@common/hooks/useDocumentTitle'
import { useStrings } from 'framework/exports'
import i18n from './InputSetList.i18n'
import { InputSetListView } from './InputSetListView'
import css from './InputSetList.module.scss'

const InputSetList: React.FC = (): JSX.Element => {
  const [searchParam, setSearchParam] = React.useState('')
  const [page, setPage] = React.useState(0)
  const { projectIdentifier, orgIdentifier, accountId, pipelineIdentifier, module } = useParams<
    PipelineType<PipelinePathProps> & { accountId: string }
  >()

  const { data: inputSet, loading, refetch, error } = useGetInputSetsListForPipeline({
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier,
      pipelineIdentifier,
      pageIndex: page,
      pageSize: 10,
      searchTerm: searchParam
    },
    debounce: 300
  })

  const [selectedInputSet, setSelectedInputSet] = React.useState<{
    identifier?: string
  }>()
  const history = useHistory()
  const { getString } = useStrings()
  useDocumentTitle([getString('pipelines'), getString('inputSetsText')])

  const goToInputSetForm = React.useCallback(
    (inputSetIdentifier = '-1') => {
      history.push(
        routes.toInputSetForm({
          accountId,
          orgIdentifier,
          projectIdentifier,
          pipelineIdentifier,
          inputSetIdentifier: typeof inputSetIdentifier !== 'string' ? '-1' : inputSetIdentifier,
          module
        })
      )
    },
    [accountId, orgIdentifier, projectIdentifier, pipelineIdentifier, module, history]
  )
  const [showOverlayInputSetForm, hideOverlayInputSetForm] = useModalHook(
    () => (
      <OverlayInputSetForm
        identifier={selectedInputSet?.identifier}
        hideForm={() => {
          refetch()
          hideOverlayInputSetForm()
        }}
      />
    ),
    [selectedInputSet]
  )
  return (
    <>
      <Page.Header
        title={
          <Popover
            minimal
            content={
              <Menu>
                <MenuItem
                  text={i18n.inputSet}
                  onClick={() => {
                    goToInputSetForm()
                  }}
                />
                <MenuItem
                  text={i18n.overlayInputSet}
                  onClick={() => {
                    showOverlayInputSetForm()
                  }}
                />
              </Menu>
            }
            position={Position.BOTTOM}
          >
            <Button text={i18n.newInputSet} rightIcon="caret-down" intent="primary"></Button>
          </Popover>
        }
        toolbar={
          <Layout.Horizontal spacing="small">
            <TextInput
              leftIcon="search"
              placeholder={i18n.searchInputSet}
              className={css.search}
              value={searchParam}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchParam(e.target.value.trim())
              }}
            />
          </Layout.Horizontal>
        }
      ></Page.Header>
      <Page.Body
        loading={loading}
        error={error?.message}
        retryOnError={/* istanbul ignore next */ () => refetch()}
        noData={{
          when: () => !inputSet?.data?.content?.length,
          icon: 'yaml-builder-input-sets',
          message: i18n.aboutInputSets,
          buttonText: i18n.addInputSet,
          onClick: () => goToInputSetForm()
        }}
      >
        <InputSetListView
          data={inputSet?.data}
          gotoPage={setPage}
          goToInputSetDetail={(identifier, type) => {
            setSelectedInputSet({ identifier })
            if (type === 'INPUT_SET') {
              goToInputSetForm(identifier)
            } else {
              showOverlayInputSetForm()
            }
          }}
          refetchInputSet={refetch}
        />
      </Page.Body>
    </>
  )
}

export default InputSetList
