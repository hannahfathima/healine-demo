import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";
import commonSlice from "./reducers/commonSlice";
import departmentSlice from "./reducers/departmentSlice";
import establishmentSlice from "./reducers/establishmentSlice";
import professionSlice from "./reducers/professionSlice";
import specialitySlice from "./reducers/specialitySlice";
import bannerSlice from "./reducers/bannerSlice";
import nationalitySlice from "./reducers/nationalitySlice";
import zoneSlice from "./reducers/zoneSlice";
import citySlice from "./reducers/citySlice";
import faqReducer from "./reducers/faqSlice";
import demoLoginReducer from './reducers/demoSlice';
import bookingReducer from './reducers/bookingSlice';
import adminSlice from "./reducers/adminSlice";
export default configureStore({
  reducer: {
    auth: authSlice,
    profession: professionSlice,
    establishment: establishmentSlice,
    common: commonSlice,
    speciality: specialitySlice,
    department: departmentSlice,
    banner: bannerSlice,
    nationality: nationalitySlice,
    zone: zoneSlice,
    city: citySlice,
    faq: faqReducer,
    demoLogin: demoLoginReducer,
    booking: bookingReducer,
    admin: adminSlice,
  },
});
