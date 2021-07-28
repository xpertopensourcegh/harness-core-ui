import React, { Dispatch, SetStateAction } from 'react'
import type { FormikProps } from 'formik'
import { Button, Color, Layout, Text } from '@wings-software/uicore'
import { RadioGroup, Radio } from '@blueprintjs/core'
import { useStrings, UseStringsReturn } from 'framework/strings'
import Table from '@common/components/Table/Table'
import type { artifactTableItem } from '../../utils/TriggersWizardPageUtils'
import css from './ArtifactTableInfo.module.scss'

interface ArtifactTableInfoInterface {
  artifactTableData?: any
  selectedArtifact?: any
  selectedArtifactLabel?: string
  artifactType?: string
  selectedStage?: string
  isManifest: boolean
  setSelectedStage?: Dispatch<SetStateAction<any>>
  setSelectedArtifact?: Dispatch<SetStateAction<any>>
  setSelectedArtifactLabel?: Dispatch<SetStateAction<any>>
  formikProps: any
  appliedArtifact?: any
  readonly?: boolean
}

interface RenderColumnSelectColumn {
  selectedArtifactLabel?: string
}
export interface FormValues {
  artifact?: string
}

export interface RenderColumnRow {
  original: artifactTableItem
}
interface RenderColumnLocationColumn {
  formikProps: FormikProps<FormValues>
  getString: UseStringsReturn['getString']
}

const RenderColumnSelect = ({ row, column }: { row: RenderColumnRow; column: RenderColumnSelectColumn }) => {
  const data = row.original
  return (
    <>
      <Layout.Horizontal spacing="small" style={{ justifyContent: 'center' }}>
        <RadioGroup
          selectedValue={column?.selectedArtifactLabel}
          label=""
          name="artifactLabel"
          onChange={e => e.preventDefault()}
        >
          <Radio value={data.artifactLabel} />
        </RadioGroup>
      </Layout.Horizontal>
    </>
  )
}

// const RenderColumnEdit = ({ row, column }) => {
//   const { values } = column.formikProps
//   const data = row.original
//   return (
//     <>
//       <Layout.Horizontal spacing="small" style={{ justifyContent: 'center' }} >
//         <Button
//           style={{ color: 'var(--primary-7)' }}
//           minimal
//           className={css.actionButton}
//           icon="edit"
//           onClick={e => {

//           }}
//         />
//       </Layout.Horizontal>
//     </>
//   )
// }

const RenderColumnArtifactLabel = ({ row }: { row: RenderColumnRow }) => {
  const data = row.original
  return (
    <Layout.Horizontal>
      <Text color={Color.BLACK}>{data.artifactLabel}</Text>
    </Layout.Horizontal>
  )
}
const RenderColumnArtifactRepository = ({ row }: { row: RenderColumnRow }) => {
  const data = row.original
  return (
    <Layout.Horizontal>
      <Text color={Color.BLACK}>{data.artifactRepository}</Text>
    </Layout.Horizontal>
  )
}

const RenderColumnLocation = ({ row, column }: { row: RenderColumnRow; column: RenderColumnLocationColumn }) => {
  const data = row.original
  const readonly = column?.formikProps?.values?.artifact
  return (
    <Layout.Horizontal>
      {readonly ? (
        <Button
          style={{ color: column?.formikProps?.values?.artifact ? 'var(--primary-7)' : 'var(--black)', padding: '0' }}
          minimal
        >
          {column?.getString('pipeline.triggers.artifactTriggerConfigPanel.configureInputs')}
        </Button>
      ) : (
        <Text color={Color.BLACK}>
          {data.buildTag || column?.getString('pipeline.triggers.artifactTriggerConfigPanel.parameterized')}
        </Text>
      )}
    </Layout.Horizontal>
  )
}

const RenderColumnBuildTag = ({ row }: { row: RenderColumnRow }) => {
  const data = row.original
  return (
    <Layout.Horizontal spacing="small">
      <Text color={Color.BLACK}>{data.buildTag}</Text>
    </Layout.Horizontal>
  )
}

const RenderColumnVersion = ({ row }: { row: RenderColumnRow }) => {
  const data = row.original
  return (
    <Layout.Horizontal spacing="small">
      <Text color={Color.BLACK}>{data.version}</Text>
    </Layout.Horizontal>
  )
}

const RenderColumnHasRuntimeInputs = ({ row }: { row: RenderColumnRow }) => {
  const data = row.original
  return (
    <Layout.Horizontal spacing="small">
      <Text color={Color.BLACK}>{data.hasRuntimeInputs ? 'Yes' : 'No'}</Text>
    </Layout.Horizontal>
  )
}

const ArtifactTableInfo = (props: ArtifactTableInfoInterface): JSX.Element => {
  const {
    readonly,
    appliedArtifact,
    setSelectedArtifact,
    selectedArtifactLabel,
    setSelectedArtifactLabel,
    setSelectedStage,
    formikProps,
    isManifest,
    artifactTableData
  } = props

  const { getString } = useStrings()
  const newData = appliedArtifact || artifactTableData
  const columns: any = React.useMemo(
    () => [
      {
        Header: getString?.('pipeline.triggers.artifactTriggerConfigPanel.artifact').toUpperCase(),
        accessor: 'artifactLabel',
        width: '25%',
        Cell: RenderColumnArtifactLabel,
        className: 'className',
        class: 'class',
        disableSortBy: !!appliedArtifact
      },
      {
        Header: getString?.('pipeline.triggers.artifactTriggerConfigPanel.artifactRepository').toUpperCase(),
        accessor: 'activity',
        width: '25%',
        Cell: RenderColumnArtifactRepository,
        disableSortBy: true,
        getString
      },
      {
        Header: getString?.('common.location').toUpperCase(),
        accessor: 'lastExecutionTime',
        width: '20%',
        Cell: RenderColumnLocation,
        disableSortBy: true,
        formikProps,
        getString
      }
    ],
    [appliedArtifact, formikProps, getString]
  )

  if (!newData) {
    return <></>
  }

  if (!readonly) {
    columns.unshift({
      Header: '',
      accessor: 'select',
      width: '7%',
      disableSortBy: true,
      selectedArtifactLabel,
      formikProps,
      Cell: RenderColumnSelect
    })
  }

  // Insert Location when available
  if (isManifest) {
    columns.push({
      Header: getString?.('version').toUpperCase(),
      accessor: 'version',
      width: '10%',
      Cell: RenderColumnVersion,
      disableSortBy: true
    })
  } else {
    columns.push({
      Header: getString?.('pipeline.triggers.artifactTriggerConfigPanel.buildTag').toUpperCase(),
      accessor: 'buildTag',
      width: '10%',
      Cell: RenderColumnBuildTag,
      disableSortBy: true
    })
  }

  columns.push({
    Header: getString?.('pipeline.triggers.artifactTriggerConfigPanel.hasRuntimeInputs').toUpperCase(),
    accessor: 'hasRuntimeInputs',
    width: '10%',
    Cell: RenderColumnHasRuntimeInputs,
    disableSortBy: true
  })

  //   Edit will be with Location column
  //    else {
  //     columns.push({
  //       Header: ' ',
  //       accessor: 'edit',
  //       width: '10%',
  //       disableSortBy: true,
  //       selectedArtifact,
  //       formikProps,
  //       Cell: RenderColumnEdit
  //     })
  //   }

  return (
    <Table
      className={`${css.table} ${readonly && css.readonly}`}
      columns={columns}
      data={Array.isArray(newData) ? newData : [newData]}
      onRowClick={item => {
        setSelectedArtifact?.(item?.artifactId)
        setSelectedStage?.(item?.stageId)
        setSelectedArtifactLabel?.(item?.artifactLabel)
      }}
    />
  )
}
export default ArtifactTableInfo
