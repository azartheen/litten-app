/**
 * @format
 * @flow
 */

import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Alert, Dimensions, StyleSheet, View } from 'react-native'
import { UIActionSheet, UIButton, UILoader, UIText } from 'ui-elements'
import { vh } from 'react-native-expo-viewport-units'
import MapView, { Marker } from 'react-native-maps'
import {
  isValidLocation,
  parseGoogleMapResponse,
  mapGoogleLocationKeys,
} from 'utils/functions'
import {
  getExternalGeoInformation,
  getReverseGeoInformation,
} from 'utils/network'
import { translate } from 'utils/i18n'

const { width: wWidth, height: wHeight } = Dimensions.get('window')

const ASPECT_RATIO = wWidth / wHeight
const LATITUDE_DELTA = 0.03
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const initialRegion = {
  latitude: null,
  longitude: null,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
}

const NewLocationMapForm: (args: any) => React$Node = ({
  authenticatedUser: {
    extra: { location: profileLocation },
  },
  setCountry,
  setFormType,
  setLocation,
}) => {
  const [region, setRegion] = useState(initialRegion)
  const [coordinate, setCoordinate] = useState(null)
  const [selectLocation, setSelectedLocation] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const navigation = useNavigation()

  useEffect(() => {
    const { latitude, longitude } = region
    setCoordinate({ latitude, longitude })
  }, [region])

  const fillLocationInfo = async (): Promise<any> => {
    if (
      !selectLocation?.coordinates?.latitude &&
      !selectLocation?.coordinates?.longitude &&
      coordinate?.latitude &&
      coordinate?.longitude
    ) {
      setIsLoading(true)
      const coordinates = coordinate
      const data = await getReverseGeoInformation(coordinates)
      if (data) {
        const [first] = data
        if (first) {
          const parsed = mapGoogleLocationKeys(parseGoogleMapResponse(first))
          const newLocation: any = { ...parsed, coordinates }
          setSelectedLocation(newLocation)
          return newLocation
        }
      }
      setIsLoading(false)
    }
    return selectLocation
  }

  const setCurrentLocation = async (): Promise<void> => {
    setIsLoading(true)
    const data = await getExternalGeoInformation()
    if (data) {
      const { latitude, longitude, country_code, region_name, city } = data
      const coordinates = { latitude, longitude }
      setCoordinate(coordinates)
      setRegion({ ...initialRegion, latitude, longitude })
      setSelectedLocation(
        ({
          country: country_code,
          administrativeArea4: region_name,
          administrativeArea5: city,
          coordinates,
        }: any),
      )
    }
    setIsLoading(false)
  }

  const setProfileLocation = () => {
    console.log(profileLocation)
    setSelectedLocation(profileLocation)
  }

  const useExistingLocation = () => {
    UIActionSheet(
      {
        options: [
          translate('cta.cancel'),
          translate('screens.new.useCurrentLocation'),
          translate('screens.new.useProfileLocation'),
          translate('screens.new.useCustomLocation'),
        ],
        destructiveButtonIndex: null,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          setCurrentLocation()
        } else if (buttonIndex === 2) {
          setProfileLocation()
        } else if (buttonIndex === 3) {
          setFormType('manual')
        }
      },
    )
  }

  const chooseLocation = async () => {
    const loc = await fillLocationInfo()
    if (isValidLocation((loc: any))) {
      setLocation(loc)
      navigation.goBack()
    } else {
      Alert.alert(translate('feedback.errorMessages.invalidLocation'))
    }
  }

  return (
    <View style={styles.mapContainer}>
      <UILoader active={isLoading} transparent />
      <UIText>{translate('screens.new.addLocationDescription')}</UIText>
      <MapView
        onRegionChange={setRegion}
        style={styles.map}
        rotateEnabled={false}
        showsUserLocation>
        {coordinate?.latitude && (
          <Marker
            coordinate={coordinate}
            onDragEnd={(e) => setCoordinate(e.nativeEvent.coordinate)}
            draggable
          />
        )}
      </MapView>
      <View style={styles.extraContainer}>
        <UIButton onPress={useExistingLocation} disabled={isLoading} secondary>
          {translate('screens.new.useExistingLocation')}
        </UIButton>
      </View>
      <View style={styles.extraContainer}>
        <UIButton onPress={chooseLocation} disabled={isLoading}>
          {translate('cta.done')}
        </UIButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  map: {
    minHeight: vh(50),
    borderRadius: 20,
  },
  extraContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 14,
  },
})

export default NewLocationMapForm