export const orgMockData = {
  data: {
    status: 'SUCCESS',
    data: {
      pageCount: 1,
      itemCount: 3,
      pageSize: 50,
      content: [
        {
          accountIdentifier: 'testAcc',
          identifier: 'testOrg',
          name: 'test org',
          color: '#e6b800',
          description: 'test',
          tags: ['tag1', 'tag2'],
          lastModifiedAt: 1599715118275
        },
        {
          accountIdentifier: 'testAcc',
          identifier: 'testOrg2',
          name: 'test org 2',
          color: '#e6b800',
          description: '',
          tags: [],
          lastModifiedAt: 1599715118275
        }
      ],
      pageIndex: 0,
      empty: false
    },
    metaData: undefined,
    correlationId: '370210dc-a345-42fa-b3cf-69bd64eb5073'
  },
  loading: false
}
