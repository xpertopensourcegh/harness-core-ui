/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import { BannerType } from '@common/layouts/Constants'
import { getBannerText } from '../UsageLimitUtils'

describe('Usage Limit Utils', () => {
  describe('when optional data are undefined', () => {
    test('it should not display message or banner when count is undefined', () => {
      const limit = 25000
      const expectedMessage = undefined
      const getString = jest.fn().mockReturnValue(expectedMessage)

      const additionalLicenseProps = {
        isFreeEdition: true,
        isEnterpriseEdition: false,
        isTeamEdition: false
      }
      const { message, bannerType } = getBannerText(getString, additionalLicenseProps, limit)

      expect(message).toEqual(expectedMessage)
      expect(bannerType).toEqual(BannerType.INFO)
    })

    test('it should not display message or banner when limit is undefined', () => {
      const count = 24000
      const expectedMessage = undefined
      const getString = jest.fn().mockReturnValue(expectedMessage)

      const additionalLicenseProps = {
        isFreeEdition: true,
        isEnterpriseEdition: false,
        isTeamEdition: false
      }
      const { message, bannerType } = getBannerText(getString, additionalLicenseProps, count)

      expect(message).toEqual(expectedMessage)
      expect(bannerType).toEqual(BannerType.INFO)
    })

    test('it should not display message or banner when limit and count is undefined', () => {
      const expectedMessage = undefined
      const getString = jest.fn().mockReturnValue(expectedMessage)

      const additionalLicenseProps = {
        isFreeEdition: true,
        isEnterpriseEdition: false,
        isTeamEdition: false
      }
      const { message, bannerType } = getBannerText(getString, additionalLicenseProps)

      expect(message).toEqual(expectedMessage)
      expect(bannerType).toEqual(BannerType.INFO)
    })
  })

  const limit = 25000
  describe('when user has the Free Plan', () => {
    const additionalLicenseProps = {
      isFreeEdition: true,
      isEnterpriseEdition: false,
      isTeamEdition: false
    }

    test('it should not display message or banner when count is 0', () => {
      const count = 0
      const expectedMessage = undefined
      const getString = jest.fn().mockReturnValue(expectedMessage)

      const { message, bannerType } = getBannerText(getString, additionalLicenseProps, count, limit)

      expect(message).toEqual(expectedMessage)
      expect(bannerType).toEqual(BannerType.INFO)
    })

    test('it should not display message or banner when usage is below 90%', () => {
      const count = 22000
      const expectedMessage = undefined
      const getString = jest.fn().mockReturnValue(expectedMessage)

      const { message, bannerType } = getBannerText(getString, additionalLicenseProps, count, limit)

      expect(message).toEqual(expectedMessage)
      expect(bannerType).toEqual(BannerType.INFO)
    })

    test('it should display message and banner when usage is 90%', () => {
      const count = 22500
      const expectedMessage = 'You have used 90% of your Monthly Active Users (MAU) subscription limit.'
      const getString = jest.fn().mockReturnValue(expectedMessage)

      const { message, bannerType } = getBannerText(getString, additionalLicenseProps, count, limit)

      expect(message).toEqual(expectedMessage)
      expect(bannerType).toEqual(BannerType.INFO)
    })

    test('it should return correct message when usage is above 90% and less than 100%', () => {
      const count = 24000
      const expectedMessage =
        'You have used 96% of Monthly Active Users (MAU) included in the free plan. After 25K MAUs, flag management will be restricted.'

      const getString = jest.fn().mockReturnValue(expectedMessage)
      const { message, bannerType } = getBannerText(getString, additionalLicenseProps, count, limit)

      expect(message).toEqual(expectedMessage)
      expect(bannerType).toEqual(BannerType.INFO)
    })

    test('it should return correct message when usage is 99%', () => {
      const count = 24999

      const expectedMessage =
        'You have used 99% of Monthly Active Users (MAU) included in the free plan. After 25K MAUs, flag management will be restricted.'

      const getString = jest.fn().mockReturnValue(expectedMessage)
      const { message, bannerType } = getBannerText(getString, additionalLicenseProps, count, limit)

      expect(message).toEqual(expectedMessage)
      expect(bannerType).toEqual(BannerType.INFO)
    })

    test('it should display warning message when usage is 100%', () => {
      const count = 25000
      const expectedMessage =
        'You have used 25k / 25k  free Monthly Active Users (MAU) this month. Consider upgrading to manage more MAUs.'

      const getString = jest.fn().mockReturnValue(expectedMessage)
      const { message, bannerType } = getBannerText(getString, additionalLicenseProps, count, limit)

      expect(message).toEqual(expectedMessage)
      expect(bannerType).toEqual(BannerType.LEVEL_UP)
    })

    test('it should display warning message when usage is greater than 100%', () => {
      const count = 25001
      const expectedMessage =
        'You have used 25k / 25k  free Monthly Active Users (MAU) this month. Consider upgrading to manage more MAUs.'

      const getString = jest.fn().mockReturnValue(expectedMessage)
      const { message, bannerType } = getBannerText(getString, additionalLicenseProps, count, limit)

      expect(message).toEqual(expectedMessage)
      expect(bannerType).toEqual(BannerType.LEVEL_UP)
    })
  })

  describe('when user has the Team or Enterprise Plan', () => {
    const additionalLicenseProps = {
      isFreeEdition: false,
      isEnterpriseEdition: true,
      isTeamEdition: true
    }

    test('it should not display message or banner when count is 0', () => {
      const count = 0
      const expectedMessage = undefined
      const getString = jest.fn().mockReturnValue(expectedMessage)

      const { message, bannerType } = getBannerText(getString, additionalLicenseProps, count, limit)

      expect(message).toEqual(expectedMessage)
      expect(bannerType).toEqual(BannerType.INFO)
    })

    test('it should not display message or banner when usage is below 90%', () => {
      const count = 22000
      const expectedMessage = undefined
      const getString = jest.fn().mockReturnValue(expectedMessage)

      const { message, bannerType } = getBannerText(getString, additionalLicenseProps, count, limit)

      expect(message).toEqual(expectedMessage)
      expect(bannerType).toEqual(BannerType.INFO)
    })

    test('it should display message and banner when usage is 90%', () => {
      const count = 22500
      const expectedMessage = 'You have used 90% of your Monthly Active Users (MAU) subscription limit.'
      const getString = jest.fn().mockReturnValue(expectedMessage)

      const { message, bannerType } = getBannerText(getString, additionalLicenseProps, count, limit)

      expect(message).toEqual(expectedMessage)
      expect(bannerType).toEqual(BannerType.INFO)
    })

    test('it should return correct message when usage is above 90% and less than 100%', () => {
      const count = 24000
      const expectedMessage = 'You have used 96% of your Monthly Active Users (MAU) subscription limit.'

      const getString = jest.fn().mockReturnValue(expectedMessage)
      const { message, bannerType } = getBannerText(getString, additionalLicenseProps, count, limit)

      expect(message).toEqual(expectedMessage)
      expect(bannerType).toEqual(BannerType.INFO)
    })

    test('it should return correct message when usage is 99%', () => {
      const count = 24999
      const expectedMessage = 'You have used 99% of your Monthly Active Users (MAU) subscription limit.'

      const getString = jest.fn().mockReturnValue(expectedMessage)
      const { message, bannerType } = getBannerText(getString, additionalLicenseProps, count, limit)

      expect(message).toEqual(expectedMessage)
      expect(bannerType).toEqual(BannerType.INFO)
    })

    test('it should display warning message when usage is 100%', () => {
      const count = 25000
      const expectedMessage = 'You have exceeded your Monthly Active Users (MAU) subscription limit.'

      const getString = jest.fn().mockReturnValue(expectedMessage)
      const { message, bannerType } = getBannerText(getString, additionalLicenseProps, count, limit)

      expect(message).toEqual(expectedMessage)
      expect(bannerType).toEqual(BannerType.LEVEL_UP)
    })

    test('it should display warning message when usage is greater than 100%', () => {
      const count = 25001
      const expectedMessage = 'You have exceeded your Monthly Active Users (MAU) subscription limit.'

      const getString = jest.fn().mockReturnValue(expectedMessage)
      const { message, bannerType } = getBannerText(getString, additionalLicenseProps, count, limit)

      expect(message).toEqual(expectedMessage)
      expect(bannerType).toEqual(BannerType.LEVEL_UP)
    })
  })
})
