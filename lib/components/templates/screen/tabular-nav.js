/**
 * @format
 * @flow
 */

import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useNavigation, useNavigationState } from '@react-navigation/native'
import colors from 'styles/colors'

const ScreenTabularNav: (args: any) => React$Node = ({
  tabs = [],
  style = null,
}) => {
  const navigation = useNavigation()

  const navIdx = useNavigationState((state) => state?.index)

  return (
    <View style={StyleSheet.compose(styles.container, style)}>
      {tabs &&
        tabs.map(({ key, name, title }, idx) => (
          <Pressable
            key={key}
            onPress={() => navigation.navigate(name)}
            style={
              navIdx === idx
                ? StyleSheet.compose(styles.tab, styles.activeTab)
                : styles.tab
            }>
            <Text style={styles.text}>{title}</Text>
          </Pressable>
        ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.black,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
})

export default ScreenTabularNav
