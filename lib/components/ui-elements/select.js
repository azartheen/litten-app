/**
 * @format
 * @flow
 */

import { useState } from 'react'
import { Platform, Pressable, StyleSheet, View } from 'react-native'
import UIInput from './input'
import IOSSelect from './inner-components/select-ios'
import AndroidSelect from './inner-components/select-android'
import { UI_SELECT_OPTION_HEIGHT } from 'utils/constants'
import colors from 'styles/colors'

const UISelectPlatform = Platform.select({
  ios: () => IOSSelect,
  android: () => AndroidSelect,
})()

const UISelect: (args: any) => React$Node = ({
  error,
  errorMessage,
  items,
  placeholder,
  selectedValue,
  ...otherProps
}) => {
  const [selectorOpen, setSelectorOpen] = useState(false)

  const toggleModal = () => setSelectorOpen(!selectorOpen)

  const translateSelectedValue = () =>
    items.find(({ value }) => value === selectedValue)?.label

  return (
    <View style={styles.selectContainer}>
      {/* $FlowFixMe: onTouchStart in an undocumented feature */}
      <Pressable onTouchStart={toggleModal}>
        <UIInput
          placeholder={placeholder}
          editable={false}
          style={StyleSheet.compose(
            styles.selectInput,
            selectorOpen ? { borderBottomColor: colors.black } : {},
          )}
          value={translateSelectedValue()}
          error={error}
          errorMessage={errorMessage}
          active={selectorOpen}
        />
      </Pressable>
      <UISelectPlatform
        items={items}
        selectedValue={selectedValue}
        selectorOpen={selectorOpen}
        toggleModal={toggleModal}
        {...otherProps}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  selectContainer: {
    width: '100%',
    borderWidth: 0,
  },
  selectInput: {
    height: UI_SELECT_OPTION_HEIGHT,
    width: '100%',
  },
})

export default UISelect
