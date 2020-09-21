import {
  ExecutionPipeline,
  ExecutionPipelineItemStatus,
  ExecutionPipelineItemType
} from 'modules/common/components/ExecutionStageDiagram/ExecutionPipelineModel'

export const pipelineData: ExecutionPipeline<string> = {
  items: [
    {
      item: {
        identifier: '386749038757493',
        name: 'Stage 1',
        type: ExecutionPipelineItemType.PIPELINE,
        status: ExecutionPipelineItemStatus.SUCCESS,
        data: 'some data....',
        icon: 'ci-hover'
      }
    },
    {
      item: {
        identifier: '12345',
        name: 'parallel group',
        data: 'some data ...',
        icon: 'arrow-up',
        type: ExecutionPipelineItemType.DEPLOY,
        status: ExecutionPipelineItemStatus.PENDING
      },
      parallel: [
        {
          item: {
            identifier: '86870204576748343',
            name: 'Stage 2',
            type: ExecutionPipelineItemType.DEPLOY,
            status: ExecutionPipelineItemStatus.PENDING,
            data: 'some data....',
            icon: 'cd-hover'
          }
        },
        {
          item: {
            identifier: '8687020457674834323er',
            name: 'Stage 3',
            type: ExecutionPipelineItemType.DEPLOY,
            status: ExecutionPipelineItemStatus.PENDING,
            data: 'some data....',
            icon: 'ce-beta'
          }
        },
        {
          item: {
            identifier: '8687020457674834323er',
            name: 'Stage 4',
            type: ExecutionPipelineItemType.DEPLOY,
            status: ExecutionPipelineItemStatus.PENDING,
            data: 'some data....',
            icon: 'arrow-up'
          }
        }
      ]
    },
    {
      item: {
        identifier: '757492047574930',
        name: 'Stage 5',
        type: ExecutionPipelineItemType.DEPLOY,
        status: ExecutionPipelineItemStatus.PENDING,
        data: 'some data....',
        icon: 'arrow-up'
      }
    },
    {
      item: {
        identifier: '5847565993757493',
        name: 'Stage 6',
        type: ExecutionPipelineItemType.DEPLOY,
        status: ExecutionPipelineItemStatus.FAILED,
        data: 'some data....',
        icon: 'command-icon'
      }
    },
    {
      item: {
        identifier: '2424635553637282',
        name: 'Stage 7',
        type: ExecutionPipelineItemType.PIPELINE,
        status: ExecutionPipelineItemStatus.PENDING,
        data: 'some data....',
        icon: 'cv-hover'
      }
    }
  ]
}
