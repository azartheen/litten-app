/**
 * @format
 * @flow
 */

import { StyleSheet, View } from 'react-native'
import UIImage from './image'
import { USER_AVATAR_SIZE_MEDIUM, USER_AVATAR_SIZE_MINI } from 'utils/constants'

const UIAvatar: (args: any) => React$Node = ({
  containerStyle,
  size = 'mini',
  source,
  style,
  ...otherProps
}) => {
  const getSize = () => {
    switch (size) {
      case 'medium':
        return styles.uiAvatarSizeMedium
      default:
        return styles.uiAvatarSizeMini
    }
  }

  return (
    <View style={[containerStyle, styles.uiAvatarImageContainer, getSize()]}>
      {source && (
        <UIImage source={source} style={[getSize(), style]} {...otherProps} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  uiAvatarImageContainer: {
    overflow: 'hidden',
  },
  uiAvatarSizeMedium: {
    height: USER_AVATAR_SIZE_MEDIUM,
    width: USER_AVATAR_SIZE_MEDIUM,
    borderRadius: USER_AVATAR_SIZE_MEDIUM / 2,
  },
  uiAvatarSizeMini: {
    height: USER_AVATAR_SIZE_MINI,
    width: USER_AVATAR_SIZE_MINI,
    borderRadius: USER_AVATAR_SIZE_MINI / 2,
  },
})

export default UIAvatar
