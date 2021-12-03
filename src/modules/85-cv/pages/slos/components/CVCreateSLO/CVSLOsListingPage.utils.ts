import type { UserJourneyDTO, UserJourneyResponse } from 'services/cv'

export const getUserJourneys = (userJourneyResponse?: UserJourneyResponse[]): UserJourneyDTO[] => {
  return userJourneyResponse?.map(response => response.userJourney) ?? []
}
