import 'bootstrap/dist/css/bootstrap.min.css';
import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/nav/Header';
import Admin from './pages/admin/Admin';
import Login from './pages/auth/Login';
import CandidateDetails from './pages/candidate-details/CandidateDetails';
import Candidate from './pages/candidate/Candidate';
import Evaluation from './pages/evaluation/Evaluation';
import EvaluationSearch from './pages/evaluationSearch/EvaluationSearch';
import { useAuth } from './store/authContext';

function App() {
  const { isAdmin } = useAuth();
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path='/candidate-exam/:batchId/:id' element={<Candidate />} />
        <Route path='/login' element={<Login />} />
        {isAdmin ? <> <Route path='/evaluation' element={<Evaluation />} />
          <Route path='/evaluation-search/:id/:batchId/:rollNo' element={<EvaluationSearch />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/' element={<Admin />} />
          <Route path='/candidate-details/:batchId/:id' element={<CandidateDetails />} /> </> : null
        }</Routes>
      <Toaster />
    </div>
  );
}

export default App;
