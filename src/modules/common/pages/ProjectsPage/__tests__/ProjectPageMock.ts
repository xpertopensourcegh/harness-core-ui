export default {
  status: 'SUCCESS' as const,
  data: {
    totalPages: 1,
    totalElements: 1,
    size: 100,
    content: [
      {
        id: 'test_id',
        accountIdentifier: 'test_acc',
        orgIdentifier: 'test_org',
        identifier: 'test_id',
        name: 'test_name',
        color: '#ffcc00',
        modules: [],
        description: 'This is a test card',
        owners: ['test_acc'],
        tags: ['test', 'card']
      }
    ],
    pageNumber: 0,
    empty: false
  },
  metaData: null,
  correlationId: 'e65e9353-fe9f-4851-81dd-b45ea069d547'
}
