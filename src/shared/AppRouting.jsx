import React, { lazy, Suspense } from "react";
import { Routing } from "./constants/routing";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Profile from "../pages/settings/Profile";
import EstablishmentHolidayList from "../pages/establishments/holidays/EstablishmentHolidayList";
import { AddEstablishmentHoliday } from "../pages/establishments/holidays/AddEstablishmentHoliday";
import EditEstablishmentHoliday from "../pages/establishments/holidays/EditEstablishmentHoliday";
import AddestablishmentImages from "../pages/establishmentImages/AddestablishmentImages";
import Spinner from "../shared/components/Spinner"; // Adjust path as needed

const Zones = lazy(() => import("../pages/zones/Zones"));
const Cities = lazy(() => import("../pages/cities/Cities"));
const Nationalities = lazy(() =>
  import("../pages/nationalities/Nationalities")
);

const EstablishmentSubTypes = lazy(() =>
  import("../pages/establishmentSubTypes/EstablishmentSubTypes")
);
const AddEstablishmentWorkingHours = lazy(() =>
  import(
    "../pages/establishments/workingHours.jsx/AddEstablishmentWorkingHours"
  )
);
const EditEstablishmentWorkingHours = lazy(() =>
  import(
    "../pages/establishments/workingHours.jsx/EditEstablishmentWorkingHours"
  )
);

/* Import lazy routes */
const MainLayout = lazy(() => import("../components/Sidebar/MainLayout"));
const ManageEstablishmentHours = lazy(() =>
  import("../pages/establishments/ManageEstablishmentHours")
);
const PublicLayout = lazy(() => import("../components/Sidebar/PublicLayout"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Login = lazy(() => import("../pages/auth/Login"));
const Proffesionals = lazy(() => import("../pages/professions/Proffesionals"));
const AddProfession = lazy(() => import("../pages/professions/AddProfession"));
const ViewProfession = lazy(() =>
  import("../pages/professions/ViewProfession")
);
const EditProfession = lazy(() =>
  import("../pages/professions/EditProfession")
);
const Establishment = lazy(() =>
  import("../pages/establishments/Establishment")
);
const EstablishmentImages = lazy(() =>
  import("../pages/establishmentImages/establishmentImages")
);
const AddEstablishmentImages = lazy(() =>
  import("../pages/establishmentImages/AddestablishmentImages")
);
const AddEstablishment = lazy(() =>
  import("../pages/establishments/AddEstablishment")
);
const EditEstablishment = lazy(() =>
  import("../pages/establishments/EditEstablishment")
);
const ViewEstablishment = lazy(() =>
  import("../pages/establishments/ViewEstablishment")
);

const ProfessionsTypes = lazy(() =>
  import("../pages/professionTypes/ProfessionTypes")
);

const Languages = lazy(() => import("../pages/languages/Languages"));

const EstablishmentTypes = lazy(() =>
  import("../pages/establishmentTypes/EstablishmentTypes")
);


const Logout = lazy(() => import("../pages/auth/Logout"));

const routes = [
  {
    path: Routing.Initial,
    component: Login,
    isPrivateRoute: false,
  },
  {
    path: Routing.Login,
    component: Login,
    isPrivateRoute: false,
  },
  {
    path: Routing.Professionals,
    component: Proffesionals,
    isPrivateRoute: true,
  },
  {
    path: Routing.AddProfessionals,
    component: AddProfession,
    isPrivateRoute: true,
  },
  {
    path: Routing.ViewProfessionals,
    component: ViewProfession,
    isPrivateRoute: true,
  },
  {
    path: Routing.Profile,
    component: Profile,
    isPrivateRoute: true,
  },
  {
    path: Routing.EditProfessionals,
    component: EditProfession,
    isPrivateRoute: true,
  },
  {
    path: Routing.Establishment,
    component: Establishment,
    isPrivateRoute: true,
  },
  {
    path: Routing.EstablishmentImages,
    component: EstablishmentImages,
    isPrivateRoute: true,
  },
  {
    path: Routing.AddEstablishmentImages,
    component: AddEstablishmentImages,
    isPrivateRoute: true,
  },
  {
    path: Routing.ManageEstablishmentHours,
    component: ManageEstablishmentHours,
    isPrivateRoute: true,
  },
  {
    path: Routing.AddEstablishment,
    component: AddEstablishment,
    isPrivateRoute: true,
  },
  {
    path: Routing.EditEstablishment,
    component: EditEstablishment,
    isPrivateRoute: true,
  },
  {
    path: Routing.AddEstablishmentWorkingHours,
    component: AddEstablishmentWorkingHours,
    isPrivateRoute: true,
  },
  {
    path: Routing.EditEstablishmentWorkingHours,
    component: EditEstablishmentWorkingHours,
    isPrivateRoute: true,
  },
  {
    path: Routing.ViewEstablishment,
    component: ViewEstablishment,
    isPrivateRoute: true,
  },
  {
    path: Routing.ManageEstablishmentHoliday,
    component: EstablishmentHolidayList,
    isPrivateRoute: true,
  },
  {
    path: Routing.AddEstablishmentHoliday,
    component: AddEstablishmentHoliday,
    isPrivateRoute: true,
  },
  {
    path: Routing.EditEstablishmentHoliday,
    component: EditEstablishmentHoliday,
    isPrivateRoute: true,
  },
  {
    path: Routing.EstablishmentTypes,
    component: EstablishmentTypes,
    isPrivateRoute: true,
  },
  // {
  //   path: Routing.EstablishmentSubTypes,
  //   component: EstablishmentSubTypes,
  //   isPrivateRoute: true,
  // },
  {
    path: Routing.ProfessionsTypes,
    component: ProfessionsTypes,
    isPrivateRoute: true,
  },
  {
    path: Routing.Nationalities,
    component: Nationalities,
    isPrivateRoute: true,
  },
  {
    path: Routing.Languages,
    component: Languages,
    isPrivateRoute: true,
  },
  {
    path: Routing.Zones,
    component: Zones,
    isPrivateRoute: true,
  },
  {
    path: Routing.Cities,
    component: Cities,
    isPrivateRoute: true,
  },
  {
    path: Routing.Logout,
    component: Logout,
    isPrivateRoute: true,
  },
];
export const AppRouting = () => {
  return (
    <Router>
      <ToastContainer className="toaster" theme="dark" />

      <Routes>
        {routes
          .filter((route) => !route.isPrivateRoute)
          .map((route, index) => {
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Suspense fallback={<Spinner />}>
                    <PublicLayout>
                      <route.component />
                    </PublicLayout>
                  </Suspense>
                }
              />
            );
          })}
      </Routes>

      <Routes>
        {routes
          .filter((route) => route.isPrivateRoute)
          .map((route, index) => {
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Suspense fallback={<Spinner />}>
                    <MainLayout>
                      <route.component />
                    </MainLayout>
                  </Suspense>
                }
              />
            );
          })}
      </Routes>
      {/* <Redirect to={{ pathname: Routing.Login }} /> */}
      {/* <Route>404 Not Found</Route> */}
      {/* <Routes>
        <Route path="*" element={<> not found</>} />
      </Routes> */}
    </Router>
  );
};