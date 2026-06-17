import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { getProfile } from "./services/authService";
import { setUser, logoutUser, setLoading } from "./features/auth/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading());
    getProfile()
      .then((response) => {
        dispatch(setUser(response.user));
      })
      .catch(() => {
        dispatch(logoutUser());
      });
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;