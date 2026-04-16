import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import LogCenterPage from './pages/LogCenterPage';
import 'antd/dist/reset.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/logs" element={<LogCenterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
