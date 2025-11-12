// import { Routes, Route } from 'react-router-dom';
// import Preloader from "./components/Preloader";
// import { useEffect, useState } from 'react';
// import Home from './Pages/Home';
// import Upload from './Pages/Upload';
// import Documentation from './Pages/Documentation';
// import Positive from './Pages/Positive';
// import Negative from './Pages/Negative';
// import Login from "./Pages/Login";
// import Register from "./Pages/Register";
// import RequireAuth from "./components/RequireAuth";

// function App() {
//   const [isLoading, setIsLoading] = useState(true);

//     const { user, isAuthenticated, isLoading } = useSelector(
//       (state) => state.auth
//     );
//     const dispatch = useDispatch();
  
//     useEffect(() => {
//       dispatch(checkAuth());
//     }, [dispatch]);
  

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 100);
//     return () => clearTimeout(timer);
//   }, []);

//   if (isLoading) {
//     return <Preloader />;
//   }

//   return (
//     <div>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route
//           path="/upload"
//           element={
//             <RequireAuth>
//               <Upload />
//             </RequireAuth>
//           }
//         />
//         <Route path="/documentation" element={<Documentation />} />
//         <Route path="/positive" element={<Positive />} />
//         <Route path="/negative" element={<Negative />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;







import { Routes, Route } from 'react-router-dom';
import Preloader from "./components/Preloader";
import { useEffect, useState, useSelector } from 'react';
import Home from './Pages/Home';
import Upload from './Pages/Upload';
import Documentation from './Pages/Documentation';
import Positive from './Pages/Positive';
import Negative from './Pages/Negative';
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Admin from "./Pages/Admin"
import { useAuth } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';
import Blocked from './Pages/Blocked';
import ForgotPasswordPage from './Pages/ForgotPasswordPage';

function App(){
  const { isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={
        <RequireAuth allowedRoles={['user']}>
          <Upload />
        </RequireAuth>
      } />
      <Route path="/admin" element={
        <RequireAuth allowedRoles={['admin']}>
          <Admin />
        </RequireAuth>
      } />
      <Route path="/documentation" element={<Documentation />} />
         <Route path="/positive" element={<Positive />} />
         <Route path="/negative" element={<Negative />} />
         <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        // in your Routes
      <Route path="/blocked" element={<Blocked />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />


    </Routes>
  );
}

export default App;