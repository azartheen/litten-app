/**
 * @format
 * @flow
 */

import { Pressable, StyleSheet, Text } from 'react-native'
import {
  UI_BUTTON_FIXED_WIDTH,
  UI_PRESSED_OPACITY,
  RECOMMENDED_MINIMUM_TAPPABLE_SIZE,
} from 'utils/constants'
import colors from 'styles/colors'

const UIButton: (args: any) => React$Node = ({
  children,
  compact = false,
  danger = false,
  disabled = false,
  fluid = false,
  onPress,
  secondary = false,
  style,
  textStyle,
  ...otherProps
}) => {
  const fluidity = fluid ? styles.fluid : styles.notFluid

  const getStyle = () => {
    if (danger) {
      if (disabled) {
        return dangerDisabledStyle
      }
      return dangerStyle
    }
    if (secondary) {
      if (disabled) {
        return secondaryDisabledStyle
      }
      return secondaryStyle
    }
    if (disabled) {
      return primaryDisabledStyle
    }
    return primaryStyle
  }

  return (
    <Pressable
      {...otherProps}
      onPress={disabled ? null : onPress}
      style={({ pressed }) => [
        getStyle(),
        compact ? styles.compact : fluidity,
        style,
        pressed ? styles.pressedStyle : undefined,
      ]}>
      <Text style={StyleSheet.compose(styles.uiButtonText, textStyle)}>
        {children}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  uiButton: {
    minHeight: RECOMMENDED_MINIMUM_TAPPABLE_SIZE,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.purple,
  },
  fluid: {
    flex: 1,
    width: '100%',
  },
  notFluid: {
    width: UI_BUTTON_FIXED_WIDTH,
  },
  compact: {
    paddingLeft: 32,
    paddingRight: 32,
  },
  uiButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondary: {
    backgroundColor: colors.blue,
  },
  danger: {
    backgroundColor: colors.red,
  },
  pressedStyle: {
    opacity: UI_PRESSED_OPACITY,
  },
  disabled: {
    opacity: 0.3,
  },
})

const primaryStyle = styles.uiButton
const primaryDisabledStyle = StyleSheet.compose(primaryStyle, styles.disabled)
const secondaryStyle = StyleSheet.compose(primaryStyle, styles.secondary)
const secondaryDisabledStyle = StyleSheet.compose(
  secondaryStyle,
  styles.disabled,
)
const dangerStyle = StyleSheet.compose(primaryStyle, styles.danger)
const dangerDisabledStyle = StyleSheet.compose(dangerStyle, styles.disabled)

export default UIButton
