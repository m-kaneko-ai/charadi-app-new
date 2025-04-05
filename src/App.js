import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CharacterDiagnosis from './components/CharacterDiagnosis'; // Import component
import Dashboard from './Dashboard'; // Dashboardコンポーネントのパスを調整してください

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div>
            <CharacterDiagnosis />
          </div>
        } />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;