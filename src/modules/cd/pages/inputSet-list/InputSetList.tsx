import React from 'react'
import { Popover, Button, Layout, TextInput, useModalHook } from '@wings-software/uikit'
import { Menu, MenuItem, Position } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'
import { Page } from 'modules/common/exports'
import { useGetInputSetsListForPipeline } from 'services/cd-ng'
import { InputFormType, InputSetForm } from 'modules/cd/components/InputSetForm/InputSetForm'
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
    queryParams: { accountIdentifier: accountId, orgIdentifier, projectIdentifier, pipelineIdentifier, page, size: 10 }
  })

  const [selectedInputSet, setSelectedInputSet] = React.useState<string>()

  const [showInputSetForm, hideInputSetForm] = useModalHook(
    () => (
      <InputSetForm
        formType={InputFormType.InputForm}
        identifier={selectedInputSet}
        hideForm={() => {
          refetch()
          hideInputSetForm()
        }}
      />
    ),
    [selectedInputSet]
  )
  const [showOverlayInputSetForm, hideOverlayInputSetForm] = useModalHook(
    () => (
      <InputSetForm
        formType={InputFormType.OverlayInputForm}
        identifier={selectedInputSet}
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
                    setSelectedInputSet(undefined)
                    showInputSetForm()
                  }}
                />
                <MenuItem
                  text={i18n.overlayInputSet}
                  onClick={() => {
                    setSelectedInputSet(undefined)
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
        retryOnError={() => refetch()}
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
          goToInputSetDetail={identifier => {
            setSelectedInputSet(identifier)
            showInputSetForm()
          }}
          refetchInputSet={refetch}
        />
      </Page.Body>
    </>
  )
}

export default InputSetList
