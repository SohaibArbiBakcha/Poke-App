import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { PokemonList } from './pages/PokemonList';
import { PokemonDetail } from './pages/PokemonDetail';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<PokemonList />} />
            <Route path="/pokemon/:id" element={<PokemonDetail />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;