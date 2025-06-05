/**
 * # Main Application Component Tutorial
 * ------------------------------------
 * This is the entry point of your React application.
 * It sets up routing and the overall application structure.
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaymentForm from './components/PaymentForm';
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Step 2: Define Routes */}
        {/* --------------------- */}
        {/* Routes component contains all possible routes in your application */}
        <Routes>
          {/* Home page route - displays the payment form */}
          <Route path="/" element={<PaymentForm />} />
          
          {/* Success page route - displayed after successful payment */}
          <Route path="/success" element={<SuccessPage />} />
          
          {/* Cancel page route - displayed if payment is cancelled */}
          <Route path="/cancel" element={<CancelPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
