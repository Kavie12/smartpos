import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import ListProduct from './pages/ProductList';
import { Container, Toolbar } from '@mui/material';

function App() {
  return (
    <>
      <NavBar/>
      <Toolbar>
        <Container fluid sx={{mt: 15}}>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/add" element={<AddProduct/>}/>
            <Route path="/list" element={<ListProduct/>}/>
          </Routes>
        </Container>
      </Toolbar>
    </>
  )
}

export default App;
