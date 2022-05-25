import './styles/App.scss';
import PageContainer from './components/Containers/PageContainer';
import Navbar from './components/Navbar/Navbar';
import { Routes, Route, Outlet } from 'react-router-dom';
import MobileNavbar from './components/Navbar/MobileNavbar';
import Auth from './pages/Auth';
import MainContainer from './components/Containers/MainContainer';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <PageContainer optionClass={'pageContainer'}>
        <Navbar />
        <div className='mobileMenu'>
          <MobileNavbar />
        </div>
        <Routes>
          {/* AUTH PAGE */}
          <Route path='/auth' element={<Auth />}></Route>
          {/* PROTECTED ROUTES */}
          <Route element={<Outlet />}>


            {/* HOME */}
            <Route path='/' element={<Home />} />

            {/* 404 */}
            <Route
              path='/*'
              element={
                <MainContainer>
                  <span style={{ fontSize: '1.2rem' }}>404 Page Not Found</span>
                </MainContainer>
              } />
          </Route>
        </Routes>
      </PageContainer>
    </div>
  );
}

export default App;
