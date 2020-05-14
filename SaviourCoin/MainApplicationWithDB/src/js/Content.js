import React from 'react'
import DBview from './DBview'
import DBcreate from './DBcreate'

class Content extends React.Component {
  render() {
    return (
      <div>
        <div>
          <h1>Account 1</h1>
          <p>Address: {this.props.to}</p>
          <p>Balance: {this.props.balanceTo}</p><br />
          <h1>Account 2</h1>
          <p>Address: {this.props.from}</p>
          <p>Balance: {this.props.balanceFrom}</p>

          <a href="#" onClick={() => this.transferCurrency(this.props.from, this.props.to, 10)}><button>Transfer &gt;</button></a><br />
          <a href="#" onClick={() => this.transferCurrency(this.props.to, this.props.from, 10)}><button>Transfer &lt;</button></a>
          
          <DBview/>
          <DBcreate/>

        </div>
      </div>
    )
  }
}

export default Content