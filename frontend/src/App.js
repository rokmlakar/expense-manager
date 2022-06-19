import './styles/App.scss';
import PageContainer from './components/Containers/PageContainer';
import Navbar from './components/Navbar/Navbar';
import MobileNavbar from './components/Navbar/MobileNavbar';
import MainContainer from './components/Containers/MainContainer';
import ProtectedRoutes from './components/ProtectedRoutes';
import { AuthProvider } from './context/AuthProvider';

import Settings from './pages/Settings';
import Home from './pages/Home';
import Auth from './pages/Auth';

import { Routes, Route, Outlet } from 'react-router-dom';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClientProvider } from 'react-query';
import { queryClient } from './constants/config';


function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <PageContainer optionClass={'pageContainer'}>
              <Navbar />
              <div className='mobileMenu'>
                <MobileNavbar />
              </div>
              <Routes>
                {/* AUTH PAGE */}
                <Route path='/auth' element={<Auth />}></Route>
                {/* PROTECTED ROUTES */}
                <Route element={<ProtectedRoutes />}>


                  {/* HOME */}
                  <Route path='/' element={<Home />} />

                  {/* SETTINGS */}
                  <Route path='/settings' element={<Settings />} />

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
          </AuthProvider>
        <ReactQueryDevtools/>
      </QueryClientProvider>
    </div>
  );
}

export default App;
