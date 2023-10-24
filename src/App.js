import './App.css';
import Home from './pages/Home'
import {Routes, Route, HashRouter} from "react-router-dom"
function App() {
  return ( 
    <HashRouter>
      <Routes>
        <Route path='/'>
          <Route index element={<Home/>}/>
        </Route>
      </Routes>
    </HashRouter>
   );
}

export default App;