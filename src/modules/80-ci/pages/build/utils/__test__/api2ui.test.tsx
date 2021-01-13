import React from 'react'
import { ExecutionPipelineNode, ExecutionPipelineItemStatus } from '@pipeline/exports'
import type { ItemData } from '../../context/BuildPageContext'
import { getStagesStatusesCounter } from '../api2ui'

jest.mock('@common/components/YAMLBuilder/YamlBuilder', () => ({ children }: { children: JSX.Element }) => (
  <div>{children}</div>
))

describe('api2ui', () => {
  test('getStagesStatusesCounter', () => {
    const nodes: ExecutionPipelineNode<ItemData>[] = [
      {
        item: { status: ExecutionPipelineItemStatus.SUCCESS }
      },
      {
        item: { status: ExecutionPipelineItemStatus.SUCCEEDED }
      },
      {
        parallel: [
          { item: { status: ExecutionPipelineItemStatus.RUNNING } },
          { item: { status: ExecutionPipelineItemStatus.PAUSED } },
          { item: { status: ExecutionPipelineItemStatus.PAUSING } },
          { item: { status: ExecutionPipelineItemStatus.WAITING } },
          { item: { status: ExecutionPipelineItemStatus.ABORTING } }
        ]
      },
      {
        parallel: [
          { item: { status: ExecutionPipelineItemStatus.FAILED } },
          { item: { status: ExecutionPipelineItemStatus.ABORTED } },
          { item: { status: ExecutionPipelineItemStatus.ERROR } },
          { item: { status: ExecutionPipelineItemStatus.REJECTED } }
        ]
      }
    ] as ExecutionPipelineNode<ItemData>[]

    const statusCounter = getStagesStatusesCounter(nodes)

    expect(statusCounter.success).toBe(2)
    expect(statusCounter.running).toBe(5)
    expect(statusCounter.failed).toBe(4)
  })
})
