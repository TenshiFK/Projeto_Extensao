import { Routes, Route } from 'react-router-dom'


import Home from '../pages/Home';

//gabriel: Rotas, no caso / -> home.
function RoutesApp(){
  return(
    <Routes>
        <Route path="/" element={ <Home/> } />
    </Routes>
  )
}

export default RoutesApp;