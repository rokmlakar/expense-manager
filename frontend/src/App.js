import './styles/App.scss';
import PageContainer from './components/Containers/PageContainer';
import Navbar from './components/Navbar/Navbar';
import { Routes, Route } from 'react-router-dom';
import MobileNavbar from './components/Navbar/MobileNavbar';
import Auth from './pages/Auth';

function App() {
  return (
    <div className="App">
      <PageContainer optionClass={'pageContainer'}>
        <Navbar />
        <div className='mobileMenu'>
          <MobileNavbar />
        </div>
        <Routes>
          <Route>
            {/* AUTH PAGE */}
            <Route path='/auth' element={<Auth/>}></Route>
          </Route>
        </Routes>
      </PageContainer>
    </div>
  );
}

export default App;
