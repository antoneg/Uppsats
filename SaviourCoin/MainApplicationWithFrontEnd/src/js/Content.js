import React from 'react'

class Content extends React.Component {
  render() {
    return (
      <div>
        <p>This is Content.js</p>
        <p>Your balance: {this.props.balance}</p>
        <p>Your account: {this.props.account}</p>
      </div>
    )
  }
}

export default Content