/**
 * @format
 * @flow
 */

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { AuthenticatedUserActions } from 'store/actions/authenticated-user'
import { FormNewActions } from 'store/actions/form-new'
import NewForm from './form-new'
import type { Dispatch, State } from 'store/types/state'
import type { NewForm as NewFormType } from 'store/types'
import type { BasicUser } from 'model/types/user'

type OwnProps = {||}
type StateProps = {|
  +formNew: NewFormType,
  +user: BasicUser,
|}
type AutheUserActions = typeof AuthenticatedUserActions
type NewActions = typeof FormNewActions
type DispatchProps = {|
  ...AutheUserActions,
  ...NewActions,
|}
type NewFormProps = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps,
|}

const mapStateToProps = (state: State): StateProps => ({
  formNew: state.formNew,
  user: state.authenticatedUser.extra,
})

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators(
    { ...AuthenticatedUserActions, ...FormNewActions },
    dispatch,
  )

export default connect<
  NewFormProps,
  OwnProps,
  StateProps,
  DispatchProps,
  State,
  Dispatch,
>(
  mapStateToProps,
  mapDispatchToProps,
)(NewForm)
