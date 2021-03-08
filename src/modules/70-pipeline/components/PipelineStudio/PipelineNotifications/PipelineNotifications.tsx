import React, { useState } from 'react'
import { get, isNil } from 'lodash-es'
import produce from 'immer'
import NotificationTable, { NotificationRulesItem } from '@pipeline/components/Notifications/NotificationTable'
import type { NotificationRules } from 'services/pipeline-ng'
import { Actions } from '@pipeline/components/Notifications/NotificationUtils'
import { PipelineContext } from '../PipelineContext/PipelineContext'
import css from './PipelineNotifications.module.scss'

const PAGE_SIZE = 10

export const PipelineNotifications: React.FC = (): JSX.Element => {
  const {
    state: { pipeline },
    updatePipeline
  } = React.useContext(PipelineContext)

  const [page, setPage] = React.useState(0)

  const [selectedNotificationTypeFilter, setSelectedNotificationTypeFilter] = useState<string | undefined>(undefined)

  const allRowsData: NotificationRulesItem[] = get(pipeline, 'notificationRules', []).map(
    (notificationRules: NotificationRules, index: number) => ({
      index,
      notificationRules
    })
  )

  // filter table data
  let data = allRowsData
  if (selectedNotificationTypeFilter) {
    data = allRowsData.filter(
      item => item.notificationRules.notificationMethod?.type === selectedNotificationTypeFilter
    )
  }

  return (
    <div className={css.pipelineNotifications}>
      <NotificationTable
        data={data.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)}
        pageIndex={page}
        totalPages={Math.ceil(data.length / PAGE_SIZE)}
        pageItemCount={PAGE_SIZE}
        pageSize={PAGE_SIZE}
        filterType={selectedNotificationTypeFilter}
        totalItems={data.length}
        gotoPage={index => {
          setPage(index)
        }}
        onFilterType={type => {
          setSelectedNotificationTypeFilter(type)
        }}
        onUpdate={(notificationItem, action, closeModal) => {
          const index = notificationItem?.index
          const notification = notificationItem?.notificationRules
          if (action === Actions.Delete) {
            updatePipeline(
              produce(pipeline, draft => {
                ;(draft as any).notificationRules.splice(index, 1)
              })
            )
          } else if (action === Actions.Added && notification) {
            updatePipeline(
              produce(pipeline, draft => {
                if (isNil((draft as any).notificationRules)) {
                  ;(draft as any).notificationRules = []
                }
                notification.enabled = true
                ;(draft as any).notificationRules.unshift(notification)
              })
            ).then(() => {
              closeModal?.()
            })
          } else if (action === Actions.Update && notification) {
            updatePipeline(
              produce(pipeline, draft => {
                ;(draft as any).notificationRules.splice(index, 1, notification)
              })
            ).then(() => {
              closeModal?.()
            })
          }
        }}
      />
    </div>
  )
}
