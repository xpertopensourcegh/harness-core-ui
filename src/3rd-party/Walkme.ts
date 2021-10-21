declare global {
  interface Window {
    WalkMeAPI: unknown
    WalkMeInsightsAPI: {
      startPlaybackRecording: () => void
    }
  }
}

const WAIT_FOR_WALKME_INSIGHTS_API_TIME_OUT = 250

export function injectWalkme(): void {
  // Note: We can exclude Harness/Testing accounts
  const walkmeRecordingEnabled = /(app|uat).harness.io/.test(location.hostname)

  if (walkmeRecordingEnabled && !window.WalkMeAPI) {
    const script = document.createElement('script')

    script.type = 'text/javascript'
    script.async = true
    script.defer = true
    script.src =
      'https://cdn.walkme.com/users/107c110fc7a74abb8aa60c41c3c491a7/walkme_107c110fc7a74abb8aa60c41c3c491a7_https.js'

    // WalkMeInsightsAPI.startPlaybackRecording() needs to be called to enable recording
    // When it's found, wait for 1s before calling it to make sure Walkme has enough time
    // to initialize the API
    script.onload = function () {
      let walkmeInsightsDetectCounter = 0

      setTimeout(function waitForWalkmeInsights() {
        const found = window.WalkMeInsightsAPI

        if (walkmeInsightsDetectCounter <= 15 && !found) {
          walkmeInsightsDetectCounter++
          setTimeout(waitForWalkmeInsights, WAIT_FOR_WALKME_INSIGHTS_API_TIME_OUT)
        } else if (found) {
          setTimeout(function () {
            try {
              window.WalkMeInsightsAPI.startPlaybackRecording()
            } catch (e) {
              setTimeout(waitForWalkmeInsights, WAIT_FOR_WALKME_INSIGHTS_API_TIME_OUT)
            }
          }, WAIT_FOR_WALKME_INSIGHTS_API_TIME_OUT * 4)
        }
      }, WAIT_FOR_WALKME_INSIGHTS_API_TIME_OUT)
    }

    document.querySelector('head')?.appendChild(script)
  }
}
