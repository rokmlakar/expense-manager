import './styles/App.scss';
import PageContainer from './components/Containers/PageContainer';
import Navbar from './components/Navbar/Navbar';
import MobileNavbar from './components/Navbar/MobileNavbar';
import MainContainer from './components/Containers/MainContainer';
import ProtectedRoutes from './components/ProtectedRoutes';
import { AuthProvider } from './context/AuthProvider';
import { WalletContext } from './context/WalletProvider';
import { EditTrsContext } from './context/EditTransactionProvider';
import { SuperUserCon } from './context/SuperUserProvider';

import Auth from './pages/Auth';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Wallet from './pages/Wallet';
import AdminHome from './pages/AdminHome';

import { Routes, Route, Outlet } from 'react-router-dom';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClientProvider } from 'react-query';
import { queryClient } from './constants/config';
import { useState } from 'react';


function App() {
  const [walletCon, setWalletCon] = useState(0);
  const [trsCon, setTrsCon] = useState(0);
  const [superUsrCon, setSuperUsrCon] = useState(false);

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PageContainer optionClass={'pageContainer'}>
            <SuperUserCon.Provider value={{ superUsrCon, setSuperUsrCon }}>
              <Navbar />
              <div className='mobileMenu'>
                <MobileNavbar />
              </div>
              <WalletContext.Provider value={{ walletCon, setWalletCon }}>
                <EditTrsContext.Provider value={{ trsCon, setTrsCon }}>

                  <Routes>
                    {/* AUTH PAGE */}
                    <Route path='/auth' element={<Auth />}></Route>
                    {/* PROTECTED ROUTES */}
                    <Route element={<ProtectedRoutes />}>


                      {/* HOME */}

                      <Route path='/' element={<Home />} />

                      {/* SETTINGS */}
                      <Route path='/settings' element={<Settings />} />

                      {/* PROFILE */}
                      <Route path='/profile' element={<Profile />} />

                      {/* TRANSACTIONS */}
                      <Route path='/transactions' element={<Transactions />} />

                      {/* CATEGORIES */}
                      <Route path='/categories' element={<Categories />} />

                      {/* WALLET */}
                      <Route path='/wallet' element={<Wallet />} />

                      {/* ADMIN */}
                      <Route path='/admin' element={<AdminHome />} />

                      {/* 404 */}
                      <Route
                        path='/*'
                        element={
                          <MainContainer>
                            <span style={{ fontSize: '1.2rem' }}>
                              404 Page Not Found
                            </span>
                          </MainContainer>
                        } />
                    </Route>
                  </Routes>
                </EditTrsContext.Provider>
              </WalletContext.Provider>
            </SuperUserCon.Provider>
          </PageContainer>
        </AuthProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </div>
  );
}

export default App;
