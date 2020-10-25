/**
 * @format
 * @flow
 */

import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import { store } from 'store'
import { setLocationCoordinates } from 'store/actions/authenticated-user'
import { logError } from './functions'
// import { translate } from './i18n'
import appConfig from '../../app.json'

export const hasLocationPermissionIOS = async () => {
  const openSetting = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Unable to open settings')
    })
  }

  const status = await Geolocation.requestAuthorization('whenInUse')

  if (status === 'granted') {
    return true
  }

  if (status === 'denied') {
    Alert.alert('Location permission denied')
  }

  if (status === 'disabled') {
    Alert.alert(
      `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
      '',
      [
        { text: 'Go to Settings', onPress: openSetting },
        { text: "Don't Use Location", onPress: () => {} },
      ],
    )
  }

  return false
}

export const hasLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const hasPermission = await hasLocationPermissionIOS()
    return hasPermission
  }

  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  )

  if (hasPermission) {
    return true
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  )

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG)
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG)
  }

  return false
}

export const getCurrentPosition = (): Promise<any> => {
  const options = { enableHighAccuracy: true }

  return new Promise((resolve, reject) =>
    Geolocation.getCurrentPosition(resolve, reject, options),
  )
}

export const getLocation = async () => {
  const hasPermission = await hasLocationPermission()

  if (!hasPermission) {
    return
  }

  try {
    return await getCurrentPosition()
  } catch (err) {
    logError(err)
  }
}

export const setUpUserLocation = async () => {
  const {
    authenticatedUser: { extra },
  } = store.getState()
  const coordinates = extra?.location?.coordinates
  if (!coordinates || !coordinates?.latitude || !coordinates?.longitude) {
    const currentPosition = await getLocation()
    if (currentPosition?.coords) {
      const {
        coords: { latitude, longitude },
      } = currentPosition
      store.dispatch(setLocationCoordinates({ latitude, longitude }))
    }
  }
}

export const setUpApp = (authUser: any) => {
  if (authUser) {
    setUpUserLocation()
  }
}