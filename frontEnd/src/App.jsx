import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useState} from 'react';
import { DataProvider, useDataContext } from './context/DataContext';
import { ResumeJdMatcher } from './components/ResumeJdMatcher';
import { MatchResultsComponent } from './components/MatchResultsComponent';
import { MatchUnavailableComponent } from './components/MatchUnavailableComponent';
import { Toaster } from './components/ui/toaster';

function AppRoutes() {
  const { data, setData } = useDataContext();

  return (
    <Routes>
      <Route path="/" element={<ResumeJdMatcher setData={setData} />} />
      <Route 
        path="/match" 
        element={data ? <MatchResultsComponent data={data} /> : <MatchUnavailableComponent />} 
      />
    </Routes>
  );
}

export default function App() {
   const [data, setData] = useState(null);
  return (
    <DataProvider value={{ data, setData }}>
      <Router>
        <AppRoutes />
        <Toaster />
      </Router>
    </DataProvider>
  );
}