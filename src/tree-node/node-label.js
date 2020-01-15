import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Checkbox from '../checkbox'
import RadioButton from '../radio'

import styles from './index.css'
import 'balloon-css'
const cx = cn.bind(styles)

class NodeLabel extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    actions: PropTypes.array,
    title: PropTypes.string,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    partial: PropTypes.bool,
    disabled: PropTypes.bool,
    dataset: PropTypes.object,
    mode: PropTypes.oneOf(['multiSelect', 'simpleSelect', 'radioSelect', 'hierarchical']),
    showPartiallySelected: PropTypes.bool,
    onCheckboxChange: PropTypes.func,
    readOnly: PropTypes.bool,
    clientId: PropTypes.string,
    not_selectable: PropTypes.bool,
    hint: PropTypes.string,
    nodeMode: PropTypes.oneOf(['radioSelect']),
    radioGroup: PropTypes.string,
    getNodeById: PropTypes.func,
  }

  handleCheckboxChange = e => {
    const { mode, id, onCheckboxChange, nodeMode, getNodeById } = this.props

    if (mode === 'simpleSelect' || mode === 'radioSelect' || nodeMode === 'radioSelect') {
      onCheckboxChange(id, true)
    } else {
      const {
        target: { checked },
      } = e
      onCheckboxChange(id, checked)
    }
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }

  handleRadioButtonChange = e => {
    const { id, onCheckboxChange, getNodeById } = this.props
    const { target } = e
    // has to be a radio button of the same group that is not checked:
    const tagsToClose = document.querySelectorAll(`input[type='radio'][name='${target.name}']:not(:checked)`)
    tagsToClose.forEach(tagToClose => {
      const tagCloseButton = document.querySelector(`button#${tagToClose.id}_button.tag-remove`)
      // if there is a result just close the tag from the close button
      // const node_ = getNodeById(tagToClose.id)
      // if (node_.isDefaultValue) {
      //   //if clicking away from default, don't close it, just hide it
      //   const tag = document.querySelector(`#${node_._id}_tag`)
      //   if (tag) tag.classList.toggle('hidden')
      // } else if (tagToClose && tagCloseButton) tagCloseButton.click()
      if (tagToClose && tagCloseButton) tagCloseButton.click()
    })
    // And create the new tag
    onCheckboxChange(id, true)
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }
  render() {
    const { mode, title, label, id, partial, checked, not_selectable = false, nodeMode } = this.props
    const { value, disabled, showPartiallySelected, readOnly, clientId, radioGroup } = this.props
    const { hint } = this.props
    // const nodeLabelProps = { className: `node-label ${hint ? 'tooltip' : ''}` }
    const nodeLabelProps = { className: 'node-label' }
    const labelProps = { className: not_selectable ? 'not_selectable' : '' }
    // in case of simple select mode, there is no checkbox, so we need to handle the click via the node label
    // but not if the control is in readOnly or disabled state
    const shouldRegisterClickHandler = mode === 'simpleSelect' && !readOnly && !disabled && !not_selectable

    if (shouldRegisterClickHandler) {
      nodeLabelProps.onClick = this.handleCheckboxChange
    }

    const sharedProps = { id, value, checked, disabled, readOnly, tabIndex: -1 }

    return (
      <label title={title || label} htmlFor={id} {...labelProps}>
        {!not_selectable &&
          (mode === 'radioSelect' || nodeMode === 'radioSelect' ? (
            <RadioButton
              name={radioGroup || clientId}
              className="radio-item"
              onChange={this.handleRadioButtonChange}
              {...sharedProps}
            />
          ) : (
            <Checkbox
              name={id}
              className={cx('checkbox-item', { 'simple-select': mode === 'simpleSelect' })}
              indeterminate={showPartiallySelected && partial}
              onChange={this.handleCheckboxChange}
              {...sharedProps}
            />
          ))}
        {/* {mode === 'radioSelect' ? (
          <RadioButton name={clientId} className="radio-item" onChange={this.handleCheckboxChange} {...sharedProps} />
        ) : (
          selectable && (
            <Checkbox
              name={id}
              className={cx('checkbox-item', { 'simple-select': mode === 'simpleSelect' })}
              indeterminate={showPartiallySelected && partial}
              onChange={this.handleCheckboxChange}
              {...sharedProps}
            />
          )
        )} */}
        <span {...nodeLabelProps} data-balloon-length="large" aria-label={hint} data-balloon-pos="right">
          {label}
        </span>
      </label>
    )
  }
}

export default NodeLabel
