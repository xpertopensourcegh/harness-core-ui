import React from 'react'
import { Popover, Button, Layout, TextInput, useModalHook } from '@wings-software/uikit'
import { Menu, MenuItem, Position } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'
import { Page } from '@common/exports'
import { InputSetSummaryResponse, useGetInputSetsListForPipeline } from 'services/cd-ng'
import { InputFormType, InputSetForm } from '@pipeline/components/InputSetForm/InputSetForm'
import i18n from './InputSetList.i18n'
import { InputSetListView } from './InputSetListView'
import css from './InputSetList.module.scss'

const InputSetList: React.FC = (): JSX.Element => {
  const [searchParam, setSearchParam] = React.useState('')
  const [page, setPage] = React.useState(0)
  const { projectIdentifier, orgIdentifier, accountId, pipelineIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
    pipelineIdentifier: string
  }>()

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
    type?: InputSetSummaryResponse['inputSetType']
  }>()

  const [showInputSetForm, hideInputSetForm] = useModalHook(
    () => (
      <InputSetForm
        formType={
          selectedInputSet?.type === 'OVERLAY_INPUT_SET' ? InputFormType.OverlayInputForm : InputFormType.InputForm
        }
        identifier={selectedInputSet?.identifier}
        hideForm={() => {
          refetch()
          hideInputSetForm()
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
                    setSelectedInputSet({ type: 'INPUT_SET' })
                    showInputSetForm()
                  }}
                />
                <MenuItem
                  text={i18n.overlayInputSet}
                  onClick={() => {
                    setSelectedInputSet({ type: 'OVERLAY_INPUT_SET' })
                    showInputSetForm()
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
          onClick: showInputSetForm
        }}
      >
        <InputSetListView
          data={inputSet?.data}
          gotoPage={setPage}
          goToInputSetDetail={(identifier, type) => {
            setSelectedInputSet({ identifier, type })
            showInputSetForm()
          }}
          refetchInputSet={refetch}
        />
      </Page.Body>
    </>
  )
}

export default InputSetList
