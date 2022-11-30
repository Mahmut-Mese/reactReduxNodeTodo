import { useEffect } from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/features/authSlice";
import AddEditTodo from "./pages/AddEditTodo";
import SingleTodo from "./pages/SingleTodo";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));
  useEffect(() => {
    dispatch(setUser(user));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <ToastContainer />
        <Routes>
          <Route path="/todos/search" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/addTodo"
            element={
              <PrivateRoute>
                <AddEditTodo />
              </PrivateRoute>
            }
          />
          <Route
            path="/editTodo/:id"
            element={
              <PrivateRoute>
                <AddEditTodo />
              </PrivateRoute>
            }
          />
          <Route path="/todo/:id" element={<SingleTodo />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
         </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
