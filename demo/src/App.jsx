import { useState } from '../which-react'
import logo from './logo.svg'
import './App.css'

function App() {
  const [state, setState] = useState(1)


  return (
    <div className="App">
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
  )
}

export default App
