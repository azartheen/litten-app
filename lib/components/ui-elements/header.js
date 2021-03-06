/**
 * @format
 * @flow
 */

import { StyleSheet, Text } from 'react-native'
import colors from 'styles/colors'

const UIHeader: (args: any) => React$Node = ({
  children,
  style,
  subheader = false,
  ...otherProps
}) =>
  children ? (
    <Text
      {...otherProps}
      style={[
        StyleSheet.compose(styles.uiHeader, style),
        subheader ? styles.uiSubHeader : undefined,
      ]}>
      {children}
    </Text>
  ) : null

const styles = StyleSheet.create({
  uiHeader: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.black,
    paddingTop: 2,
    paddingBottom: 2,
    marginTop: 2,
    marginBottom: 2,
  },
  uiSubHeader: {
    fontSize: 16,
  },
})

export default UIHeader
