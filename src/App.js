import { ToastContainer } from 'react-toastify';
import './App.css';
import AuthProvider from './contexts/auth';
import RoutesApp from './routes/routes';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <ToastContainer autoClose={3000} />
          <RoutesApp/>
        </AuthProvider>
      </BrowserRouter>
      
    </div>
  );
}

export default App;