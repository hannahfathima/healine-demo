import "./App.css";
// import SideBar from "./components/Sidebar/SideBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// import Dashboard from "./pages/Dashboard";

// import Establishment from "./pages/establishments/Establishment";
// import FileManager from "./pages/FileManager";
// import Departments from "./pages/Departments";
// import Order from "./pages/Order";
// import Saved from "./pages/Saved";
// import { Login } from "./pages/auth/Login";
// import { Register } from "./pages/auth/Register";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "rsuite/styles/index.less";
// import Header from "./components/Sidebar/Header";
// import Proffesionals from "./pages/professions/Proffesionals";
// import AddProfession from "./pages/professions/AddProfession";
// import AddEstablishment from "./pages/establishments/AddEstablishment";
// import ViewEstablishment from "./pages/establishments/ViewEstablishment";
// import { Login } from "./pages/auth/Login";
// import { Register } from "./pages/auth/Register";
import { useEffect } from "react";
import { AppRouting } from "./shared/AppRouting";
import Loader from "./shared/components/Loader";
import instance from "./apis/ApiConfig";
import { loginSuccess } from "./store/reducers/authSlice";
import { useDispatch } from "react-redux";
function App() {
  // const [currentForm, setCurrentForm] = useState("login");

  // const [login, setlogin] = useState(false);

  // const toggleForm = (formName) => {
  // setCurrentForm(formName);
  // };

  const dispath = useDispatch();
  useEffect(() => {
    async function setUserState(params) {
      // console.log("params?.token", params?.token);
      instance.defaults.headers.common["Authorization"] = params?.token;
      await dispath(loginSuccess(params));
      // console.log(params);
    }
    // const data = await Storage.retrieveItem("userDetails");
    const data = localStorage.getItem("userDetails");
    if (data) {
      const userDetails = JSON.parse(data);
      setUserState(userDetails);
    }
  }, []);

  return (
    <>
      <Loader />
      <AppRouting />

      {/* {!login && (
        <div className="App">
          {currentForm === "login" ? (
            <Login onFormSwitch={toggleForm} setlogin={setlogin} />
          ) : (
            <Register onFormSwitch={toggleForm} />
          )}
        </div>
      )}
      {login && (
        <Router>
          <SideBar>
            <Header />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/specialities" element={<Dashboard />} />
              <Route path="/professionals" element={<Proffesionals />} />
              <Route path="/professions/add" element={<AddProfession />} />
              <Route path="/establishments" element={<Establishment />} />
              <Route
                path="/establishments/add"
                element={<AddEstablishment />}
              />
              <Route
                path="/establishments/view/:id"
                element={<ViewEstablishment />}
              />
              <Route path="/departments" element={<Departments />} />

              <Route path="*" element={<> not found</>} />
            </Routes>
          </SideBar>
        </Router>
      )} */}  
        </>
  );
}

export default App;