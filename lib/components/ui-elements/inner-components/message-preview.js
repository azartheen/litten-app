/**
 * @format
 * @flow
 */

import { StyleSheet, Text, View } from 'react-native'
import dayjs from 'utils/day'
import UIListItem from '../list-item'
import colors from 'styles/colors'

const UIMessagePreview: (args: any) => React$Node = ({
  children,
  from,
  header,
  lastActivity,
  onPress,
  read = false,
  ...otherProps
}) => {
  const messageUnreadStyle = read
    ? undefined
    : styles.uiMessagePreviewTextUnread

  return (
    <UIListItem onPress={onPress} selected={!read} {...otherProps}>
      <View style={styles.uiMessagePreviewContentMainContainer}>
        <View style={styles.uiMessagePreviewHeader}>
          <Text
            numberOfLines={1}
            style={[styles.uiMessagePreviewText, messageUnreadStyle]}>
            {header}
          </Text>
          {lastActivity && (
            <Text
              numberOfLines={1}
              style={[styles.uiMessagePreviewMessage, messageUnreadStyle]}>
              {dayjs(lastActivity).fromNow()}
            </Text>
          )}
        </View>
        <View style={styles.uiMessagePreviewMessageContainer}>
          <Text
            numberOfLines={1}
            style={[styles.uiMessagePreviewMessage, messageUnreadStyle]}>
            {children}
          </Text>
          <Text
            numberOfLines={1}
            style={[styles.uiMessagePreviewFrom, messageUnreadStyle]}>
            {from}
          </Text>
        </View>
      </View>
    </UIListItem>
  )
}

const styles = StyleSheet.create({
  uiMessagePreviewUnread: {
    backgroundColor: colors.purple,
  },
  uiMessagePreviewContentMainContainer: {
    flex: 1,
  },
  uiMessagePreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  uiMessagePreviewMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 3,
  },
  uiMessagePreviewText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
    paddingBottom: 3,
  },
  uiMessagePreviewTextUnread: {
    color: colors.white,
  },
  uiMessagePreviewFrom: {
    fontSize: 12,
  },
  uiMessagePreviewMessage: {
    fontSize: 12,
    fontWeight: '200',
  },
})

export default UIMessagePreview
