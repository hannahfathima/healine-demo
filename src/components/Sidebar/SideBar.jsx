import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import SidebarMenu from "./SidebarMenu";
import { Suspense } from "react";
import Spinner from "../../shared/components/Spinner"; // Adjust path if needed

// ICON IMPORTS
import { FaBars, FaHome, FaLock, FaPercent, FaUser } from "react-icons/fa";
import { MdLocalOffer, MdMessage } from "react-icons/md";
import { BiAnalyse, BiCog, BiTag } from "react-icons/bi";
import { AiFillHeart, AiTwotoneFileExclamation } from "react-icons/ai";
import { BsCartCheck } from "react-icons/bs";
import useAdminNotifications from "../../hooks/useAdminNotification";
import NotificationBell from "../NotificationBell";
import NotificationPopup from "../NotificationPopup";

// Wrapper component to handle hooks inside the layout
const GlobalNotificationBell = () => {
  const {
    notifications,
    newNotification,
    unreadCount,
    setUnreadCount,
    markAsRead
  } = useAdminNotifications();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <NotificationPopup notification={newNotification} />
      <NotificationBell
        unreadCount={unreadCount}
        notifications={notifications}
        markAsRead={markAsRead}
      />
      {/* Optional: Add User Profile Pic/Name here if needed */}
    </div>
  );
};

const healineLogo = "/Complete_Logo_Light[1].png";

// ⭐ MAPPING: SubRoute path → Module name (from API permissions array)
const pathToModuleMap = {
  "/specialities": "specialities",
  "/departments": "departments",
  "/professionstypes": "professionstypes",
  "/establishmenttypes": "establishmenttypes",
  "/establishment-sub-types": "establishment-sub-types",
  "/nationalities": "nationalities",
  "/languages": "languages",
  "/zones": "zones",
  "/cities": "cities",
  "/facilities": "facilities",
  "/services": "services",
  "/establishments": "establishments",
  "/professionals": "professionals",
  "/packages": "packages",
  "/biomarkers": "biomarkers",
  "/banners": "banners",
  "/faq": "faq",
  "/bookings": "bookings",
  "/demo-login": "demo-login",
  "/settings/profile": "profile",
  "/insurances": "insurances",
  "/service-bookings": "service-bookings",
  "/promotions": "promotions",
};

const routes = [
  {
    name: "Master Data",
    icon: <BiAnalyse />,
    subRoutes: [
      { path: "/specialities", name: "Specialities", icon: <FaHome /> },
      { path: "/departments", name: "Departments", icon: <BiAnalyse /> },
      { path: "/professionstypes", name: "Professions Types", icon: <BiAnalyse /> },
      { path: "/establishmenttypes", name: "Establishment Types", icon: <BiAnalyse /> },
      { path: "/establishment-sub-types", name: "Establishment Sub Types", icon: <BiAnalyse /> },
      { path: "/nationalities", name: "Nationalities", icon: <BiAnalyse /> },
      { path: "/languages", name: "Languages", icon: <BiAnalyse /> },
      { path: "/zones", name: "Zones", icon: <BiAnalyse /> },
      { path: "/cities", name: "Cities", icon: <BiAnalyse /> },
      { path: "/facilities", name: "Facilities", icon: <BiAnalyse /> },
      { path: "/services", name: "Services", icon: <BiAnalyse /> },
      { path: "/pharmacy", name: "Pharmacy", icon: <BiAnalyse /> },
      { path: "/pillpack-management", name: "PillPack Management", icon: <BiAnalyse /> },
      // { path: "/insurances", name: "Insurances", icon: <BiAnalyse /> },
    ],
  },
  {
    name: "Provider & Establishment Management",
    icon: <FaUser />,
    subRoutes: [
      { path: "/establishments", name: "Establishments", icon: <MdMessage /> },
      { path: "/professionals", name: "Professionals", icon: <FaUser /> },
    ],
  },
  {
    name: "Insurance",
    icon: <AiTwotoneFileExclamation />, // you can change icon if needed
    subRoutes: [
      { path: "/insurances", name: "Insurances", icon: <BiAnalyse /> },
    ],
  },

  {
    name: "Medical Catalog",
    icon: <AiFillHeart />,
    subRoutes: [
      { path: "/packages", name: "Medical Services", icon: <BiAnalyse /> },
      { path: "/biomarkers", name: "Biomarkers", icon: <BiAnalyse /> },
      { path: "/package-bundles", name: "Package Bundles", icon: <BiAnalyse /> },
      { path: "/package-bundles/b2b", name: "B2B Package Bundles", icon: <BiAnalyse /> },
    ],
  },
  {
    name: "Content Management",
    icon: <MdMessage />,
    subRoutes: [
      // { path: "/banners", name: "Banners", icon: <BiAnalyse /> },
      { path: "/faq", name: "FAQ", icon: <BiAnalyse /> },
    ],
  },
  {
    name: "Operations",
    icon: <BsCartCheck />,
    subRoutes: [
      { path: "/bookings", name: "Doctor Booking", icon: <BiAnalyse /> },
      { path: "/service-bookings", name: "Service Booking", icon: <BiAnalyse /> },
    ],
  },
 {
  name: "Promotions",
  icon: <MdLocalOffer />, // You can replace this with any of the suggested icons
  subRoutes: [
    { path: "/promotions", name: "Promotions", icon: <BiTag /> },
  ],
},
  {
    name: "Settings",
    icon: <AiTwotoneFileExclamation />,
    subRoutes: [
      { path: "/settings/profile", name: "Profile", icon: <FaUser /> },
      { path: "/demo-login", name: "Demo Login", icon: <FaLock /> },
      { path: "/settings/logout", name: "Logout", icon: <FaLock /> },
    ],
  },
];

// ⭐ HELPER FUNCTION: Check if user has access to route
const hasAccessToRoute = (path, userRole, userPermissions) => {
  // Super Admin (role_id = 1) gets access to everything
  if (userRole === 1) {
    return true;
  }

  // Regular admins: check if their permissions include this module
  const moduleName = pathToModuleMap[path];
  if (!moduleName) {
    // If path not in map, allow access (for unmapped routes like logout)
    return path === "/settings/logout" || path === "/settings/profile";
  }

  return userPermissions.includes(moduleName);
};

// ⭐ FILTER ROUTES: Only show routes user has access to
const filterRoutesByAccess = (routes, userRole, userPermissions) => {
  return routes
    .map((route) => {
      if (route.subRoutes) {
        // Filter sub-routes
        const filteredSubRoutes = route.subRoutes.filter((subRoute) =>
          hasAccessToRoute(subRoute.path, userRole, userPermissions)
        );

        // Only return the route if it has accessible sub-routes
        return filteredSubRoutes.length > 0
          ? { ...route, subRoutes: filteredSubRoutes }
          : null;
      }

      // Single route (no subRoutes)
      return hasAccessToRoute(route.path, userRole, userPermissions)
        ? route
        : null;
    })
    .filter(Boolean); // Remove null entries
};

const SideBar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  const auth = useSelector((state) => state.auth);
  const userRole = auth?.userInfo?.role_id;
  const userPermissions = auth?.userModules || [];

  console.log("User Role:", userRole); // Debug log
  console.log("User Permissions:", userPermissions); // Debug log

  // ⭐ Filter routes based on user's role and permissions
  const accessibleRoutes = filterRoutesByAccess(routes, userRole, userPermissions);

  console.log("Accessible Routes:", accessibleRoutes); // Debug log

  const animation = {
    hidden: { opacity: 0, width: 0 },
    show: {
      opacity: 1,
      width: "auto",
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="main-container">
      <motion.div
        className="sidebar"
        animate={{
          width: isOpen ? "250px" : "65px",
        }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        {/* LOGO */}
        <div className="sidebar-logo-wrapper">
          <Link to='/settings/profile'>
            <img src={healineLogo} alt="Healine Logo" className="sidebar-logo" />
          </Link>        </div>

        {/* FILTERED ROUTE LIST */}
        <section className="routes">
          {accessibleRoutes.map((route, index) => {
            if (route.subRoutes) {
              return (
                <SidebarMenu
                  key={index}
                  route={route}
                  isOpen={isOpen}
                  showAnimation={animation}
                  setIsOpen={setIsOpen}
                />
              );
            }

            return (
              <NavLink
                to={route.path}
                key={index}
                className="link"
                activeclassname="active"
              >
                <div className="icon-sidebar">{route.icon}</div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      className="link_text"
                      variants={animation}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                    >
                      {route.name}
                    </motion.div>
                  )}
                </AnimatePresence>
              </NavLink>
            );
          })}
        </section>
      </motion.div>

      <main>
        {/* GLOBAL HEADER BAR */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '10px 20px',

        }}>

          <GlobalNotificationBell />
        </div>

        <Suspense fallback={<Spinner />}>
          {children}
        </Suspense>
      </main>
    </div>
  );
};

export default SideBar;
