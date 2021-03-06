/**
 * @format
 * @flow
 */

import { GOOGLE_API_KEY, SLACK_WEBHOOK_URL } from '@env'
import type { DBCoordinateObject } from 'db/schemas/location'
import type { GeoInformation } from './types/network'
import { reportTypes } from './litten'
import { getFromListByKey } from './functions'
import { logError } from './dev'

/**
 * Finds geolocation information based on the device's IP address
 * @async
 * @param {string} externalIP - An external IP address
 * @returns {{ip: string, country_code: string, country_name: string, region_code: string, region_name: string, city: string, zip_code: string, time_zone: string, latitude: number, longitude: number, metro_code: number}}
 */
export async function getExternalGeoInformation(
  externalIP: string = '',
): Promise<GeoInformation> {
  const apiUri = `https://freegeoip.live/json/${externalIP}`
  let jsonData = {}
  try {
    const data = await fetch(apiUri)
    jsonData = await data.json()
  } finally {
    return jsonData
  }
}

/**
 * Finds geolocation information based on the address
 * @async
 * @param {string} address
 * @param {Array<string>} components
 * @returns {Array.<{address_components: Array<{long_name: string, short_name: string, types: string[]}>, formatted_address: string, geometry: Object, place_id: string, plus_code: Object, types: string[]}>}
 */
export async function getGeoInformation(
  address: string,
  components: string[] = [],
) {
  const apiUri = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_API_KEY}`
  let results = null
  try {
    const data = await fetch(apiUri)
    const jsonData = await data.json()
    if (jsonData?.status === 'OK') {
      results = jsonData?.results
    }
  } catch (err) {
    logError(err)
  } finally {
    return results
  }
}

/**
 * Finds reverse geolocation information based on the coordinates
 * @async
 * @param {{latitude: string, longitude: string}} coordinates
 * @returns {Array.<{address_components: Array<{long_name: string, short_name: string, types: string[]}>, formatted_address: string, geometry: Object, place_id: string, plus_code: Object, types: string[]}>}
 */
export async function getReverseGeoInformation(
  coordinates: DBCoordinateObject,
) {
  const { latitude, longitude } = coordinates
  let results = null
  if (latitude && longitude) {
    const apiUri = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
    try {
      const data = await fetch(apiUri)
      const jsonData = await data.json()
      if (jsonData?.status === 'OK') {
        results = jsonData?.results
      }
    } catch (err) {
      logError(err)
    }
  }
  return results
}

/**
 * Submits the user feedback to be recorded and returns a boolean indicating
 * whether it was successful
 * @async
 * @param {string} type - The type of feedback submitted
 * @param {string} message - The message submitted
 * @returns {boolean}
 */
export const submitUserFeedback = async (
  type: string,
  message: string,
): Promise<boolean> => {
  const { emoji = ':warning:' } = getFromListByKey(reportTypes, type) ?? {}
  const fullType = `${emoji} ${type}`
  if (process.env.NODE_ENV === 'development' && SLACK_WEBHOOK_URL) {
    const postData = {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Type:*\n${fullType}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Message*:\n${message}`,
          },
        },
      ],
    }
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
    return response.ok
  }
  return true
}
