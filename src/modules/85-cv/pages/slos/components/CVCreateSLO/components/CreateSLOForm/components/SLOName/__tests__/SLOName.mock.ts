export const mockedUserJourneysData = {
  status: 'SUCCESS',
  data: {
    totalPages: 1,
    totalItems: 3,
    pageItemCount: 3,
    pageSize: 100,
    content: [
      {
        createdAt: 1635416123988,
        lastModifiedAt: 1635416123988,
        userJourney: { identifier: 'journey3', name: 'journey-3' }
      },
      {
        createdAt: 1635415897583,
        lastModifiedAt: 1635415897583,
        userJourney: { identifier: 'journey2', name: 'journey-2' }
      },
      { createdAt: 1635415683365, lastModifiedAt: 1635415683365, userJourney: { identifier: 'Test1', name: 'Test-1' } }
    ],
    pageIndex: 0,
    empty: false
  },
  metaData: {},
  correlationId: '4084b7ee-176e-4b02-b618-0a54ffbe65c6'
}

export const expectedUserJourneyOptions = [
  {
    label: 'journey-3',
    value: 'journey3'
  },
  {
    label: 'journey-2',
    value: 'journey2'
  },
  {
    label: 'Test-1',
    value: 'Test1'
  }
]
