import React from 'react';
import FeedbackForm from './pages/FeedbackForm';
import Header from './components/Header';
import CarFinansingPage from './pages/CarFinansingPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BandaPandaPage from './pages/BandaPandaPage';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<FeedbackForm />} />
        <Route path='/auto_murabaha' element={<CarFinansingPage />} />
        <Route path='/banda_panda' element={<BandaPandaPage />} />
      </Routes>
    </Router>
  );
}

export default App;
