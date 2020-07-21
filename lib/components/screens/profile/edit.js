/**
 * @format
 * @flow strict-local
 */

import { connect } from 'react-redux'
import React from 'react'
import { View } from 'react-native'
import { UIText } from 'ui-elements'

const mapStateToProps = (state) => ({
  authenticatedUser: state.authenticatedUser,
})

const mapDispatchToProps = () => ({})

const ProfileEditScreen: () => React$Node = ({
  authenticatedUser: { basic: { displayName = 'User', photoURL = null } = {} },
}) => (
  <View>
    <UIText>{displayName}</UIText>
  </View>
)

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditScreen)