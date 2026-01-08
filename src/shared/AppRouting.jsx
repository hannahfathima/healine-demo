import React, { lazy, Suspense } from "react";
import { Routing } from "./constants/routing";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Profile from "../pages/settings/Profile";
import DepartmentHolidaysList from "../pages/departments/holidays/DepartmentHolidaysList";
import { AddDepartmentHoliday } from "../pages/departments/holidays/AddDepartmentHoliday";
import EditDepartmentHoliday from "../pages/departments/holidays/EditDepartmentHoliday";
import EstablishmentHolidayList from "../pages/establishments/holidays/EstablishmentHolidayList";
import { AddEstablishmentHoliday } from "../pages/establishments/holidays/AddEstablishmentHoliday";
import EditEstablishmentHoliday from "../pages/establishments/holidays/EditEstablishmentHoliday";
import AddestablishmentImages from "../pages/establishmentImages/AddestablishmentImages";
import Spinner from "../shared/components/Spinner"; // Adjust path as needed
import InsuranceList from "../pages/Insurances/InsuranceList";
import ServiceBookings from "../pages/bookings/ServiceBookings";
import NotificationDetail from "../components/NotificationDetail";

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
const AddDepartmentWorkingHours = lazy(() =>
  import("../pages/departments/workingHours/AddDepartmentWorkingHours")
);
const EditDepartmentWorkingHours = lazy(() =>
  import("../pages/departments/workingHours/EditDepartmentWorkingHours")
);

/* Import lazy routes */
const MainLayout = lazy(() => import("../components/Sidebar/MainLayout"));
const ManageDepartmentHours = lazy(() =>
  import("../pages/departments/ManageDepartmentHours")
);
const PublicLayout = lazy(() => import("../components/Sidebar/PublicLayout"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Login = lazy(() => import("../pages/auth/Login"));
const Proffesionals = lazy(() => import("../pages/professions/Proffesionals"));
const Banners = lazy(() => import("../pages/banners/Banners"));
const AddProfession = lazy(() => import("../pages/professions/AddProfession"));
const ViewProfession = lazy(() =>
  import("../pages/professions/ViewProfession")
);
const ManageEstablishmentHours = lazy(() =>
  import("../pages/establishments/ManageEstablishmentHours")
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
const DepartmentList = lazy(() =>
  import("../pages/departments/DepartmentList")
);
const AddDepartment = lazy(() => import("../pages/departments/AddDepartment"));
const ViewDepartment = lazy(() =>
  import("../pages/departments/ViewDepartment")
);
const EditDepartment = lazy(() =>
  import("../pages/departments/EditDepartment")
);

const ProfessionsTypes = lazy(() =>
  import("../pages/professionTypes/ProfessionTypes")
);

const Facilities = lazy(() => import("../pages/facilities/Facilities"));

const Services = lazy(() => import("../pages/services/Services"));
const ServiceBookingPage = lazy(() => import("../pages/bookings/ServiceBookings"));

const Languages = lazy(() => import("../pages/languages/Languages"));
const FAQ = lazy(() => import("../pages/FAQ/Faq"));
const Demo = lazy(() => import("../pages/Demologin/Demologin"));
const Bookings = lazy(() => import("../pages/bookings/Bookings"));
const ViewBookings = lazy(() => import("../pages/bookings/ViewBooking"));
const ViewServiceBookings = lazy(() => import("../pages/bookings/ViewServiceBooking"));

const EstablishmentTypes = lazy(() =>
  import("../pages/establishmentTypes/EstablishmentTypes")
);
const PackageBundles = lazy(() =>
  import("../pages/Packages/PackageBundles")
);

const Logout = lazy(() => import("../pages/auth/Logout"));
const SpecialitiesList = lazy(() =>
  import("../pages/specialities/SpecialitiesList")
);
const AddSpeciality = lazy(() => import("../pages/specialities/AddSpeciality"));
const EditSpeciality = lazy(() =>
  import("../pages/specialities/EditSpeciality")
);
const BiomarkerManagement = lazy(() =>
  import("../pages/BioMark/BiomarkerManagement")
);
const NotificationsPage = lazy(() =>
  import("../components/Notifications")
);
const NotificationsDetailPage = lazy(() =>
  import("../components/NotificationDetail")
);
const ViewBiomarker = lazy(() =>
  import("../pages/BioMark/ViewBiomarker")
);
const ViewBiomarkerGroup = lazy(() =>
  import("../pages/BioMark/ViewBiomarkerGroup")
);
const Packages = lazy(() =>
  import("../pages/Packages/Packages")
);
const ViewPackage = lazy(() =>
  import("../pages/Packages/ViewPackage")
);
const PackageBundleDetail = lazy(() =>
  import("../pages/Packages/PackageBundleDetail")
);
const Register = lazy(() =>
  import("../pages/auth/Register")
);
const ManageRoles = lazy(() =>
  import("../pages/settings/ManageRoles")
);
const Insurances = lazy(() =>
  import("../pages/Insurances/InsuranceList")
);
const PlanDetailPage = lazy(() =>
  import("../pages/Insurances/viewpages/PlanDetailPage")
);
const NetworkDetailPage = lazy(() =>
  import("../pages/Insurances/viewpages/NetworkDetailPage")
);
const CompanyDetailPage = lazy(() =>
  import("../pages/Insurances/viewpages/CompanyDetailPage")
);
const PharmacyList = lazy(() =>
  import("../pages/PharmacyList/PharmacyList")
);
const PharmacyProductDetail = lazy(() =>
  import("../pages/PharmacyList/viewpage/ProductDetailPage")
);
const Promotion = lazy(() =>
  import("../pages/Promotions/PromotionsTab")
);
const BundlePurchaseDetailPage = lazy(() =>
  import("../pages/Packages/BundlePurchaseDetailPage")
);
const PackageBundleB2b = lazy(() =>
  import("../pages/Packages/PackageBundleB2b")
);
const PackageBundleB2bDetail = lazy(() =>
  import("../pages/Packages/PackageBundleB2bDetail")
);
const PillPackManagement = lazy(() =>
  import("../pages/PillPackManagement/PillPackManagement")
);
const ViewPillPackManagement = lazy(() =>
  import("../pages/PillPackManagement/components/PrescriptionDetailPage")
);
// import MainLayout from "../components/Sidebar/MainLayout";
// import PublicLayout from "../components/Sidebar/PublicLayout";
// import Dashboard from "../pages/Dashboard";
// import { Login } from "../pages/auth/Login";
// import Proffesionals from "../pages/professions/Proffesionals";
// import AddProfession from "../pages/professions/AddProfession";
// import Establishment from "../pages/establishments/Establishment";
// import AddEstablishment from "../pages/establishments/AddEstablishment";
// import ViewEstablishment from "../pages/establishments/ViewEstablishment";
// import Departments from "../pages/Departments";

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
    path: Routing.Specialities,
    component: SpecialitiesList,
    isPrivateRoute: true,
  },
  {
    path: Routing.AddSpecialities,
    component: AddSpeciality,
    isPrivateRoute: true,
  },
  {
    path: Routing.EditSpecialities,
    component: EditSpeciality,
    isPrivateRoute: true,
  },
  {
    path: Routing.Specialities,
    component: SpecialitiesList,
    isPrivateRoute: true,
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
    path: Routing.Departments,
    component: DepartmentList,
    isPrivateRoute: true,
  },
  {
    path: Routing.AddDepartment,
    component: AddDepartment,
    isPrivateRoute: true,
  },
  {
    path: Routing.ViewDepartment,
    component: ViewDepartment,
    isPrivateRoute: true,
  },
  {
    path: Routing.EditDepartment,
    component: EditDepartment,
    isPrivateRoute: true,
  },
  {
    path: Routing.AddDepartmentWorkingHours,
    component: AddDepartmentWorkingHours,
    isPrivateRoute: true,
  },
  {
    path: Routing.EditDepartmentWorkingHours,
    component: EditDepartmentWorkingHours,
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
    path: Routing.ManageDepartmentHours,
    component: ManageDepartmentHours,
    isPrivateRoute: true,
  },
  {
    path: Routing.ManageDepartmentHolidays,
    component: DepartmentHolidaysList,
    isPrivateRoute: true,
  },
  {
    path: Routing.AddDepartmentHolidays,
    component: AddDepartmentHoliday,
    isPrivateRoute: true,
  },
  {
    path: Routing.EstablishmentTypes,
    component: EstablishmentTypes,
    isPrivateRoute: true,
  },
  {
    path: Routing.EstablishmentSubTypes,
    component: EstablishmentSubTypes,
    isPrivateRoute: true,
  },
  {
    path: Routing.ProfessionsTypes,
    component: ProfessionsTypes,
    isPrivateRoute: true,
  },
  {
    path: Routing.Banners,
    component: Banners,
    isPrivateRoute: true,
  },
  {
    path: Routing.Nationalities,
    component: Nationalities,
    isPrivateRoute: true,
  },
  {
    path: Routing.Facilities,
    component: Facilities,
    isPrivateRoute: true,
  },
  {
    path: Routing.Services,
    component: Services,
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
    path: Routing.FAQ,
    component: FAQ,
    isPrivateRoute: true,
  },
  {
    path: Routing.Register,
    component: Register,
    isPrivateRoute: false
  },
  {
    path: Routing.Demo,
    component: Demo,
    isPrivateRoute: true,
  },
  {
    path: Routing.Bookings,
    component: Bookings,
    isPrivateRoute: true,
  },
  {
    path: Routing.ViewBookings,
    component: ViewBookings,
    isPrivateRoute: true,
  },
  {
    path: Routing.ServiceBooking,
    component: ViewServiceBookings,
    isPrivateRoute: true,
  },
  {
    path: Routing.ServiceBookingPage,
    component: ServiceBookings,
    isPrivateRoute: true,
  },
  {
    path: Routing.BiomarkerManagement,
    component: BiomarkerManagement,
    isPrivateRoute: true,
  },
  {
    path: Routing.ViewBiomarker,
    component: ViewBiomarker,
    isPrivateRoute: true,
  },
  {
    path: Routing.ViewBiomarkerGroup,
    component: ViewBiomarkerGroup,
    isPrivateRoute: true,
  },
  {
    path: Routing.Packages,
    component: Packages,
    isPrivateRoute: true,
  },
  {
    path: Routing.ManageRoles,
    component: ManageRoles,
    isPrivateRoute: true,
  },
  {
    path: Routing.ViewPackage,
    component: ViewPackage,
    isPrivateRoute: true,
  },
  {
    path: Routing.PackageBundle,
    component: PackageBundles,
    isPrivateRoute: true,
  },
  {
    path: Routing.PackageBundleB2b,
    component: PackageBundleB2b,
    isPrivateRoute: true,
  },
  {
    path: Routing.PackageBundleB2bDetail,
    component: PackageBundleB2bDetail,
    isPrivateRoute: true,
  },
  {
    path: Routing.PackageBundleDetail,
    component: PackageBundleDetail,
    isPrivateRoute: true,
  },
  {
    path: Routing.EditDepartmentHolidays,
    component: EditDepartmentHoliday,
    isPrivateRoute: true,
  },
  {
    path: Routing.Insurances,
    component: InsuranceList,
    isPrivateRoute: true,
  },
  {
    path: Routing.PlanDetailPage,
    component: PlanDetailPage,
    isPrivateRoute: true,
  },
  {
    path: Routing.CompanyDetailPage,
    component: CompanyDetailPage,
    isPrivateRoute: true,
  },
  {
    path: Routing.NetworkDetailPage,
    component: NetworkDetailPage,
    isPrivateRoute: true,
  },
  {
    path: Routing.Notifications,
    component: NotificationsPage,
    isPrivateRoute: true,
  },
  {
    path: Routing.Pharmacy,
    component: PharmacyList,
    isPrivateRoute: true,
  },
  {
    path: Routing.PharmacyProductDetail,
    component: PharmacyProductDetail,
    isPrivateRoute: true,
  },
  {
    path: Routing.PillPackManagement,
    component: PillPackManagement,
    isPrivateRoute: true,
  },
  {
    path: Routing.ViewPillPackManagement,
    component: ViewPillPackManagement,
    isPrivateRoute: true,
  },
  {
    path: Routing.BundlePurchaseDetailPage,
    component: BundlePurchaseDetailPage,
    isPrivateRoute: true,
  },
  {
    path: Routing.NotificationDetail,
    component: NotificationsDetailPage,
    isPrivateRoute: true,
  },
  {
    path: Routing.Promotion,
    component: Promotion,
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