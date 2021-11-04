import type { SegmentFlag } from 'services/cf'

const mockSegmentFlag: SegmentFlag[] = [
  {
    description: '',
    environment: 'testnonprod',
    identifier: 'asdasdasd',
    name: 'flag_with_prereqs',
    project: 'chrisgit2',
    type: 'DIRECT',
    variation: 'true'
  }
]

export default mockSegmentFlag
