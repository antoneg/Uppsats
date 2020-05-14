import React from 'react'

class DBview extends React.Component {
	constructor(props) {
    super(props)
    this.state = {
      blogs: []
    }
 	}

	componentDidMount() {
    fetch('http://localhost:3000/blogs').then((temp) => {
      temp.json().then((blogs) => {
        this.setState({ blogs })
      })
    })
  }

  render() {
    return (
      <div>
        <div>
        <p> DBview.js </p>
        	<ul className="list-group">
            {this.state.blogs.map(blog => {
              return <li className="list-group-item" key={blog.title}>{blog.title}</li>
            })}
         	</ul>
        </div>
      </div>
    )
  }
}

export default DBview