import React from 'react'
import cx from 'classnames'
import { isEmpty } from 'lodash-es'
import { FormInput, getMultiTypeFromValue, MultiTypeInputType } from '@wings-software/uicore'
import { DurationInputFieldForInputSet } from '@common/components/MultiTypeDuration/MultiTypeDuration'
import { useStrings } from 'framework/exports'
import type { HarnessApprovalDeploymentModeProps } from './types'
import css from './HarnessApproval.module.scss'

// Temporarily commenting this till the multiselect issue is fixed and resolved
// const UGMultiSelect = ({
//   initialValues,
//   inputSetData,
//   userGroupsResponse,
//   userGroupsFetchError,
//   fetchingUserGroups,
//   onUpdate
// }: UGMultiSelectProps) => {
//   const [userGroupOptions, setUserGroupOptions] = useState<MultiSelectOption[]>([])
//   const path = inputSetData?.path
//   const prefix = isEmpty(path) ? '' : `${path}.`
//   const readonly = inputSetData?.readonly
//   const { getString } = useStrings()
//   useEffect(() => {
//     if (userGroupsResponse?.data?.content) {
//       const userGroupsContent = userGroupsResponse?.data?.content
//       const options: MultiSelectOption[] = userGroupsContent
//         ? userGroupsContent.map(ug => ({ label: ug.name || '', value: ug.identifier || '' }))
//         : []
//       setUserGroupOptions(options)
//     }
//   }, [userGroupsResponse?.data?.content])

//   return (
//     <FormInput.MultiSelect
//       className={cx(css.multiSelect, css.md)}
//       name={`${prefix}spec.approvers.userGroups`}
//       label={getString('common.userGroups')}
//       disabled={readonly}
//       items={
//         fetchingUserGroups
//           ? [{ label: getString('pipeline.approvalStep.fetchingUserGroups'), value: '', disabled: true }]
//           : userGroupOptions
//       }
//       multiSelectProps={{
//         placeholder: fetchingUserGroups
//           ? getString('pipeline.approvalStep.fetchingUserGroups')
//           : userGroupsFetchError?.message
//           ? getString('pipeline.approvalStep.fetchUserGroupsFailed')
//           : getString('pipeline.approvalStep.addUserGroups'),
//         // eslint-disable-next-line react/display-name
//         tagRenderer: item => (
//           <Layout.Horizontal key={item.label?.toString()} spacing="small">
//             <Avatar email={item.label?.toString()} size="xsmall" hoverCard={false} />
//             <Text>{item.label}</Text>
//           </Layout.Horizontal>
//         ),
//         // eslint-disable-next-line react/display-name
//         itemRender: (item, { handleClick }) => (
//           <div key={item.label.toString()}>
//             <Menu.Item
//               text={
//                 <Layout.Horizontal spacing="small" className={css.align}>
//                   <Avatar email={item.label?.toString()} size="small" hoverCard={false} />
//                   <Text>{item.label}</Text>
//                 </Layout.Horizontal>
//               }
//               onClick={handleClick}
//             />
//           </div>
//         )
//       }}
//       onChange={values => {
//         onUpdate?.({
//           ...initialValues,
//           spec: {
//             ...initialValues.spec,
//             approvers: {
//               ...initialValues.spec.approvers,
//               userGroups: values
//             }
//           }
//         })
//       }}
//     />
//   )
// }

/*
Used for iput sets and deployment form
Provide values for all runtime fields in approval step
Open the same form in readonly view while viewing already run executions
*/
export default function HarnessApprovalDeploymentMode(props: HarnessApprovalDeploymentModeProps): JSX.Element {
  const { inputSetData, onUpdate, initialValues } = props
  const template = inputSetData?.template
  const path = inputSetData?.path
  const prefix = isEmpty(path) ? '' : `${path}.`
  const readonly = inputSetData?.readonly
  const { getString } = useStrings()

  return (
    <React.Fragment>
      {getMultiTypeFromValue(template?.timeout) === MultiTypeInputType.RUNTIME ? (
        <DurationInputFieldForInputSet
          label={getString('pipelineSteps.timeoutLabel')}
          name={`${prefix}timeout`}
          disabled={readonly}
          className={css.sm}
        />
      ) : null}

      {getMultiTypeFromValue(template?.spec?.approvalMessage) === MultiTypeInputType.RUNTIME ? (
        <FormInput.TextArea
          className={cx(css.approvalMessage, css.sm)}
          label={getString('pipeline.approvalStep.message')}
          name={`${prefix}spec.approvalMessage`}
          disabled={readonly}
        />
      ) : null}

      {typeof template?.spec?.approvers?.minimumCount === 'string' &&
      getMultiTypeFromValue(template?.spec?.approvers?.minimumCount) === MultiTypeInputType.RUNTIME ? (
        <FormInput.Text
          label={getString('pipeline.approvalStep.minimumCount')}
          name={`${prefix}spec.approvers.minimumCount`}
          disabled={readonly}
          className={css.sm}
          onChange={event => {
            const changedValue = (event.target as HTMLInputElement).value
            onUpdate?.({
              ...initialValues,
              spec: {
                ...initialValues.spec,
                approvers: { ...initialValues.spec.approvers, minimumCount: changedValue ? Number(changedValue) : 1 }
              }
            })
          }}
        />
      ) : null}
    </React.Fragment>
  )
}
