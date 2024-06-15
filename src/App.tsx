import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { checkSession } from "./backend/services/auth/checkSession";

// LIB
import useUserState from "./lib/states/userStates";
import useUserVerificationState from "./lib/states/userVerificationState";

// UI
import { Navbar, Footer } from "./components";
import { LoadingScreen } from "@/components/ui/loading";
import { Toaster } from 'sonner'

// PAGES
import {
  Home,
  PerfumeDetails,
  Collections,
  StoreDetails,
  Error,
  Policies,
  AboutDetails,
  Contact,
  CartDetails,
  SellDetails,
  SettingsDetails,
  EditDetails,
  BrowseDetails,
  UpdateDetails,
  CreateDetails,
  VerifyDetails,
} from "./pages";
import ResetDetails from "./pages/ResetDetails";



export default function App() {

  // Active loading screen while fetching data
  const [activeLoadingScreen, setActiveLoadingScreen] = useState<boolean>(true);

  // Get the userState that tracks wether of User is Logged in or Not
  const { isLoggedin, setIsLoggedin } = useUserState();

  // Update the Verification State
  const { isVerified } = useUserVerificationState();

  // Check if there's an active session by calling the checkSession() and check it's returns
  async function sessionCheck() {
    try {
      const response = await checkSession();
      setIsLoggedin(response);
    } catch (error) {
      console.error('Error checking session:', error);
      setIsLoggedin(false);
    } finally {
      setActiveLoadingScreen(false);
    }
  }

  // Check on the session everything App got mounted
  useEffect(() => {
    sessionCheck()
  }, []);



  return (
    <>
      {activeLoadingScreen ? (
        <LoadingScreen />
      ) : (
        <BrowserRouter>
          <Toaster richColors />

          <div>
            <Navbar />
            <div className="pb-10"></div>
          </div>
          <Routes>

            {/* Basic Routes */}
            <Route index element={<Home />} />
            <Route path='*' element={<Error />} />
            <Route path='policies' element={<Policies />} />
            <Route path='about' element={<AboutDetails />} />
            <Route path='cart' element={<CartDetails />} />
            <Route path='collections' element={<BrowseDetails />} />
            <Route path='reset' element={<ResetDetails />} />
            <Route path='contact' element={<Contact />} />

            {/* Verification Check */}
            <Route path='verify' element={ isVerified ? <VerifyDetails /> : <Navigate to="/" />} />

            {/* If NOT Logged-in */}
            <Route path='update' element={isLoggedin ? <UpdateDetails /> : <Navigate to="/" />} />
            <Route path='settings' element={isLoggedin ? <SettingsDetails /> : <Navigate to="/" />} />
            <Route path='sell' element={isLoggedin ? <SellDetails /> : <Navigate to="/" />} />
            <Route path="store/create" element={isLoggedin ? <CreateDetails /> : <Navigate to="/" />} />
            <Route path='edit/:id' element={isLoggedin ? <EditDetails /> : <Navigate to="/" />} />

            {/* Custom Routes */}
            <Route path='collections/:collectionID' element={<Collections />} />
            <Route path='perfumes/:perfumeID' element={<PerfumeDetails />} />
            <Route path="store/:id" element={<StoreDetails />} />

            {/* Redirect Routes */}
            <Route path="perfumes" element={<Navigate to="/" />} />
            <Route path="store" element={<Navigate to="/" />} />
            <Route path="edit" element={<Navigate to="/" />} />


          </Routes>
          <div>
            <Footer />
          </div>
        </BrowserRouter>
      )}
    </>
  )
}
