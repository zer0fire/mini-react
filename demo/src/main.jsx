import React, { Fragment, Component, useReducer } from 'react'
import { ReactDOM } from '../which-react'
import './index.css'

class ClassComponent extends Component {
  render() {
    return <div className="class" >ClassComponent</div>
  }
}
function FunctionComponent() {
  const [count, setCount] = useReducer(x => x + 1, 0)

  return (
    <div className="fn" >
      <button onClick={() => setCount} >{count}</button>
    </div>
  )
}

const jsx = (
  <div className="border">
    <h1>react</h1>
    <a href="https://github.com/bubucuo/mini-react">mini react</a>
    <div>host component</div>
    host text
    <ClassComponent/>
    <FunctionComponent/>
    <Fragment>
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul>
    </Fragment>
  </div>
);


const root = ReactDOM.createRoot(document.getElementById('root'))
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// )
root.render(jsx)