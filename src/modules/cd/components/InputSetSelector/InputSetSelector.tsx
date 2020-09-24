import React from 'react'
import {
  Button,
  Checkbox,
  Color,
  Icon,
  Layout,
  Popover,
  SelectOption,
  Tag,
  Text,
  TextInput
} from '@wings-software/uikit'
import { isArray, clone } from 'lodash-es'
import cx from 'classnames'
import { Classes, Position } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'
import { InputSetSummaryResponseDTO, useGetInputSetsListForPipeline } from 'services/cd-ng'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import { useToaster } from 'modules/common/exports'
import i18n from './InputSetSelector.i18n'
import css from './InputSetSelector.module.scss'

type InputSetValue = SelectOption | SelectOption[]

export interface InputSetSelectorProps {
  value?: InputSetValue
  onChange?: (value?: InputSetValue) => void
  width?: number
}

const RenderValue = React.memo(function RenderValue({
  value,
  onChange
}: {
  value: InputSetValue
  onChange?: (value?: InputSetValue) => void
}): JSX.Element {
  if (isArray(value)) {
    return (
      <>
        {value.map((item, index) => (
          <Tag minimal className={css.tag} key={index}>
            {item.label}
          </Tag>
        ))}
      </>
    )
  }
  return (
    <Layout.Horizontal flex={{ distribution: 'space-between' }}>
      <span>{value.label}</span>
      <div
        className={css.clearButton}
        onClick={event => {
          event.stopPropagation()
          onChange?.()
        }}
      >
        <Icon name="cross" />
      </div>
    </Layout.Horizontal>
  )
})

export const InputSetSelector: React.FC<InputSetSelectorProps> = ({ width = 300, value, onChange }): JSX.Element => {
  const [searchParam, setSearchParam] = React.useState('')
  const [multiple, setMultiple] = React.useState(false)
  const [selectedInputSets, setSelectedInputSets] = React.useState<SelectOption[]>([])

  React.useEffect(() => {
    if (isArray(value)) {
      setMultiple(true)
      setSelectedInputSets(value)
    } else if (value) {
      setSelectedInputSets([value as SelectOption])
    }
  }, [value])

  const { projectIdentifier, orgIdentifier, accountId, pipelineIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
    pipelineIdentifier: string
  }>()

  const { data: inputSetResponse, refetch, error } = useGetInputSetsListForPipeline({
    queryParams: { accountIdentifier: accountId, orgIdentifier, projectIdentifier, pipelineIdentifier },
    debounce: 300,
    lazy: true
  })

  const { showError } = useToaster()

  const onSelectHandler = React.useCallback(
    (inputSet: InputSetSummaryResponseDTO) => {
      onChange?.({ label: inputSet.name || '', value: inputSet.identifier || '' })
    },
    [onChange]
  )

  const onDragStart = React.useCallback((event: React.DragEvent<HTMLLIElement>, row: SelectOption) => {
    event.dataTransfer.setData('data', JSON.stringify(row))
    event.currentTarget.classList.add(css.dragging)
  }, [])

  const onDragEnd = React.useCallback((event: React.DragEvent<HTMLLIElement>) => {
    event.currentTarget.classList.remove(css.dragging)
  }, [])

  const onDragLeave = React.useCallback((event: React.DragEvent<HTMLLIElement>) => {
    event.currentTarget.classList.remove(css.dragOver)
  }, [])

  const onDragOver = React.useCallback((event: React.DragEvent<HTMLLIElement>) => {
    if (event.preventDefault) {
      event.preventDefault()
    }
    event.currentTarget.classList.add(css.dragOver)
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = React.useCallback(
    (event: React.DragEvent<HTMLLIElement>, droppedLocation: SelectOption) => {
      if (event.preventDefault) {
        event.preventDefault()
      }
      const data = event.dataTransfer.getData('data')
      if (data) {
        try {
          const dropInputSet: SelectOption = JSON.parse(data)
          const selected = clone(selectedInputSets)
          const droppedItem = selected.filter(item => item.value === dropInputSet.value)[0]
          if (droppedItem) {
            const droppedItemIndex = selected.indexOf(droppedItem)
            selected.splice(droppedItemIndex, 1)
            const droppedLocationIndex = selected.indexOf(droppedLocation)
            selected.splice(droppedLocationIndex, 0, droppedItem)
            setSelectedInputSets(selected)
          }
          // eslint-disable-next-line no-empty
        } catch {}
      }
      event.currentTarget.classList.remove(css.dragOver)
    },
    [selectedInputSets]
  )

  const onCheckBoxHandler = React.useCallback(
    (checked: boolean, label: string, val: string) => {
      const selected = clone(selectedInputSets)
      const removedItem = selected.filter(set => set.value === val)[0]
      if (checked && !removedItem) {
        selected.push({ label, value: val })
      } else if (removedItem) {
        selected.splice(selected.indexOf(removedItem), 1)
      }
      setSelectedInputSets(selected)
    },
    [selectedInputSets]
  )

  if (error) {
    showError(error.message)
  }
  const inputSets = inputSetResponse?.data?.content

  const singleSelectList =
    inputSets &&
    inputSets
      .filter(set => (set.identifier || '').toLowerCase().indexOf(searchParam.toLowerCase()) > -1)
      .map(inputSet => (
        <li
          className={cx(Classes.POPOVER_DISMISS, css.item)}
          onClick={() => {
            onSelectHandler(inputSet)
          }}
          key={inputSet.identifier}
        >
          <Icon name="yaml-builder-input-sets" />
          &nbsp;&nbsp;{inputSet.name}
        </li>
      ))

  const selectedMultipleList = selectedInputSets.map((selected, index) => (
    <li
      className={cx(css.item)}
      draggable={true}
      onDragStart={event => {
        onDragStart(event, selected)
      }}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={event => onDrop(event, selected)}
      onClick={() => {
        onCheckBoxHandler(false, selected.label, selected.value as string)
      }}
      key={`${index}-${selected.value as string}`}
    >
      <Layout.Horizontal flex={{ distribution: 'space-between' }}>
        <Checkbox
          className={css.checkbox}
          labelElement={
            <Text font={{ size: 'small' }} icon="yaml-builder-input-sets">
              {selected.label}
            </Text>
          }
          checked={true}
          onChange={event => {
            onCheckBoxHandler(event.currentTarget.checked, selected.label, selected.value as string)
          }}
        />
        <span className={css.order}>
          <Text className={css.orderText}>{index + 1}</Text>
          <Icon name="main-reorder" size={12} />
        </span>
      </Layout.Horizontal>
    </li>
  ))

  const multipleInputSetList =
    inputSets &&
    inputSets
      .filter(set => {
        let filter = true
        selectedInputSets.forEach(selectedSet => {
          if (selectedSet.value === set.identifier) {
            filter = false
          }
        })
        return filter
      })
      .filter(set => (set.identifier || '').toLowerCase().indexOf(searchParam.toLowerCase()) > -1)
      .map(inputSet => (
        <li
          className={cx(css.item)}
          key={inputSet.identifier}
          onClick={() => {
            onCheckBoxHandler(true, inputSet.name || '', inputSet.identifier || '')
          }}
        >
          <Layout.Horizontal flex={{ distribution: 'space-between' }}>
            <Checkbox
              className={css.checkbox}
              labelElement={
                <Text font={{ size: 'small' }} icon="yaml-builder-input-sets">
                  {inputSet.name}
                </Text>
              }
              onChange={event => {
                onCheckBoxHandler(event.currentTarget.checked, inputSet.name || '', inputSet.identifier || '')
              }}
            />
          </Layout.Horizontal>
        </li>
      ))

  return (
    <Popover
      position={Position.BOTTOM}
      minimal={true}
      onOpening={() => {
        refetch()
      }}
      onClosing={() => {
        if (multiple) {
          if (selectedInputSets.length > 0) {
            onChange?.(selectedInputSets)
          } else {
            onChange?.()
          }
        }
      }}
    >
      <Button minimal className={css.container} style={{ width }} rightIcon="caret-down">
        {value ? (
          <RenderValue value={value} onChange={onChange} />
        ) : (
          <span className={css.placeholder}>{i18n.placeholder}</span>
        )}
      </Button>
      <Layout.Vertical spacing="small" padding="medium" className={css.popoverContainer}>
        <Layout.Horizontal spacing="medium">
          <TextInput
            leftIcon="search"
            placeholder={i18n.searchInputSet}
            className={css.search}
            value={searchParam}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchParam(e.target.value.trim())
            }}
          />
          <Checkbox
            label={i18n.selectMultipleInputSets}
            checked={multiple}
            className={css.checkbox}
            onChange={checkbox => {
              setMultiple(checkbox.currentTarget.checked)
            }}
          />
        </Layout.Horizontal>
        {multiple && (
          <Layout.Horizontal
            spacing="small"
            background={Color.GREY_200}
            flex={{ align: 'center-center' }}
            padding="small"
          >
            <Icon name="info-sign" color={Color.BLUE_600}></Icon>
            <Text font={{ size: 'small' }}>{i18n.helpTextForMultiSelect}</Text>
          </Layout.Horizontal>
        )}
        {!inputSets ? (
          <PageSpinner />
        ) : (
          <Layout.Vertical>
            {multiple && (
              <Layout.Horizontal padding="small" flex={{ distribution: 'space-between' }}>
                <Text color={Color.BLACK}>{i18n.inputSet}</Text>
                <Text color={Color.BLACK}>{i18n.order}</Text>
              </Layout.Horizontal>
            )}
            {inputSets && inputSets.length > 0 ? (
              <ul className={cx(Classes.MENU, css.list, { [css.multiple]: multiple })}>
                {!multiple ? (
                  singleSelectList
                ) : (
                  <>
                    {selectedMultipleList}
                    {multipleInputSetList}
                  </>
                )}
              </ul>
            ) : (
              <Layout.Horizontal
                spacing="small"
                background={Color.GREY_200}
                flex={{ align: 'center-center' }}
                padding="small"
                margin="small"
              >
                <Text>{i18n.noRecord}</Text>
              </Layout.Horizontal>
            )}
          </Layout.Vertical>
        )}
      </Layout.Vertical>
    </Popover>
  )
}
