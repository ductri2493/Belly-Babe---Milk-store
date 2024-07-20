import './App.css';
import { RouterProvider } from 'react-router-dom';
import routes from './routes/routes.jsx';
import { AddressProvider } from './context/AddressContext';
import { AuthProvider } from './context/AuthContextUser.jsx';

function App() {
  // const [loading, setLoading] = useState(true);
  // setTimeout(() => {
  //   setLoading(false);
  // }, 1350);
  return (
    // <>
    //   {loading ? (
    //     <Loader />
    //   ) : (
    <AuthProvider>
      <AddressProvider>
        <RouterProvider router={routes} />
      </AddressProvider>
    </AuthProvider>
    // )}
    // </>
  );
}

export default App;
