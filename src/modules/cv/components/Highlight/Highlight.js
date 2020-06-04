import React from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import highlight from 'highlight.js'

// TODO: import react-highlight.js does not work, so we manually copy the component here:
export default class Highlight extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    language: PropTypes.string,
    style: PropTypes.object
  }

  isUpdating = false

  componentDidMount() {
    // eslint-disable-next-line react/no-find-dom-node
    highlight.highlightBlock(findDOMNode(this.code))
  }

  componentDidUpdate() {
    // use this flag for throttling because this function used to cause UI Performance issue (frozen ui)
    if (this.isUpdating) {
      return
    }
    this.isUpdating = true
    highlight.initHighlighting.called = false
    // eslint-disable-next-line react/no-find-dom-node
    highlight.highlightBlock(findDOMNode(this.code))
    setTimeout(() => {
      this.isUpdating = false // reset
    }, 500) // for throttling
  }

  render() {
    const { children, className, language, style } = this.props

    return (
      <pre className={className} style={style}>
        <code className={language} ref={ref => (this.code = ref)}>
          {children}
        </code>
      </pre>
    )
  }
}
