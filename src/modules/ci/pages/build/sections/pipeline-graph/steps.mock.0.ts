import {
  ExecutionPipeline,
  ExecutionPipelineItemStatus,
  ExecutionPipelineItemType
} from 'modules/common/components/ExecutionStageDiagram/ExecutionPipelineModel'

export const pipelineData: ExecutionPipeline<string> = {
  items: [
    {
      item: {
        identifier: '38674903875749323',
        name: 'Step 1',
        type: ExecutionPipelineItemType.PIPELINE,
        status: ExecutionPipelineItemStatus.PENDING,
        data: 'some data....',
        icon: 'ci-hover'
      }
    },
    {
      item: {
        identifier: '75749204757493023',
        name: 'Step 2',
        type: ExecutionPipelineItemType.DEPLOY,
        status: ExecutionPipelineItemStatus.PENDING,
        data: 'some data....',
        icon: 'arrow-up'
      }
    },
    {
      item: {
        identifier: '584756599375749323',
        name: 'Step 3',
        type: ExecutionPipelineItemType.DEPLOY,
        status: ExecutionPipelineItemStatus.PENDING,
        data: 'some data....',
        icon: 'command-icon'
      }
    },
    {
      item: {
        identifier: '2424635553637282',
        name: 'Step  4',
        type: ExecutionPipelineItemType.PIPELINE,
        status: ExecutionPipelineItemStatus.PENDING,
        data: 'some data....',
        icon: 'cv-hover'
      }
    }
  ]
}
