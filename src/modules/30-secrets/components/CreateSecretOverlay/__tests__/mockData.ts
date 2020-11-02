export const Vault = {
  status: 'SUCCESS' as const,
  data: {
    currentPage: 1,
    empty: false,
    content: [
      {
        connector: {
          description: 'This description is for Vault',
          identifier: 'VaultId',
          name: 'VaultName',
          type: '"Vault"',
          tags: ['tag1'],
          spec: {
            default: false
          }
        },
        status: {
          errorMessage: null,
          lastConnectedAt: 1601199008081,
          lastTestedAt: 1601199008081,
          status: 'SUCCESS'
        },
        createdAt: 1601198999531,
        lastModifiedAt: 1601199008088
      }
    ],
    total: 1
  },
  metaData: null,
  correlationId: 'correlationId'
}
