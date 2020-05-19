import React from 'react'
import DBview from './DBview'
import DBcreate from './DBcreate'

class Content extends React.Component {
  render() {
    return (
      <div>
        <div>

          
          <DBview/>
          <DBcreate/>

        </div>
      </div>
    )
  }
}

export default Content