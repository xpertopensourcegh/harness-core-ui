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
          name: 'Org Name',
          color: '#004fc4',
          description: 'Description',
          tags: ['tag1', 'tag2'],
          lastModifiedAt: 1602148957762
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

export const getOrgMockData = {
  data: {
    status: 'SUCCESS',
    data: {
      accountIdentifier: 'testAcc',
      identifier: 'testOrg',
      name: 'Org Name',
      color: '#004fc4',
      description: 'Description',
      tags: ['tag1', 'tag2'],
      lastModifiedAt: 1602148957762
    },
    metaData: undefined,
    correlationId: '9f77f74d-c4ab-44a2-bfea-b4545c6a4a39'
  }
}

export const createOrgMockData = {
  mutate: async () => {
    return {
      status: 'SUCCESS',
      data: {
        accountIdentifier: 'testAcc',
        identifier: 'testOrg',
        name: 'Org Name',
        color: '#004fc4',
        description: 'Description',
        tags: ['tag1', 'tag2'],
        lastModifiedAt: 1602148957762
      },
      metaData: undefined,
      correlationId: '375d39b4-3552-42a2-a4e3-e6b9b7e51d44'
    }
  },
  loading: false
}
