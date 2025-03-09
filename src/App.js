// 🚀 Importing necessary modules and components
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./FirebaseConfig/firebase";

// 🏠 Importing components
import {
  Post,
  Home,
  Details,
  UpdateProfile,
  AdminDashboard,
  Login,
  SignUp,
  OptionResults,
  Profile,
  Notification,
  Loading,
  Congratulation,
  AccountList,
  FeedbackList,
  ConfirmBox,
  AddStaff,
  StaffDashboard,
  ChatBox,
  GeneralInfo,
  UpdatePost,
  ListOfPosts,
  Test,
  StaffAccountsList,
  StaffPost,
} from "./helpers";

// 🌐 Importing context
import { AppContext } from "./Context/AppContext";

// 📦 Importing additional components
import {
  ToTop,
  NavigationBar,
  Footer,
  Sidebar,
  ImageContainer,
} from "./Components/Middle";
import { fetchUserData } from "./firebase-helpers";

// 🏷️ Main App component
function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    session,
    setOpenUserBox,
    setShowSpinner,
    setPostsWasFiltered,
    setSession,
    showImage,
    setHouses,
    setLands,
  } = useContext(AppContext);

  const hideNavAndToTop =
    location.pathname === "/real+estate/signup" ||
    location.pathname === "/real+estate/signin";
  // ⏳ useEffect to fetch data on component mount

  // 📥 Fetch house data from Firestore
  const fetchHouseDatas = async () => {
    setShowSpinner(true);
    let initialPostWasFiltered;

    try {
      await getDocs(collection(db, "houses")).then((response) => {
        const dataResponsed = response.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setHouses(dataResponsed);
        initialPostWasFiltered = dataResponsed; // CHECK LATER
      });

      await getDocs(collection(db, "lands")).then((response) => {
        const dataResponsed = response.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setLands(dataResponsed);
        initialPostWasFiltered = initialPostWasFiltered.concat(dataResponsed);
      });
      setPostsWasFiltered(initialPostWasFiltered);
    } catch (error) {
      console.log("Error when fetching house datas");
      console.log(error);
    }
    setShowSpinner(false);
  };

  const fetchUserData = async (userId) => {
    try {
      const docRef = doc(db, "user_accounts", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSession(docSnap.data());
      } else {
        console.log("No such document!");
        return;
      }
    } catch (error) {
      console.log(error); // display error messages in console panel
      return;
    }
  };

  useEffect(() => {
    fetchHouseDatas();
    const userInfo = localStorage.getItem("userInfo"); // get user data from local storage

    if (userInfo) {
      let userId = JSON.parse(userInfo).userId; // parse JSON to Object
      fetchUserData(userId);
    } else {
      setSession(null);
      navigate("/real+estate/signin");
    }
  }, []);

  return (
    <div className="relative font-roboto max-w-screen overflow-hidden">
      <Loading />
      {showImage && <ImageContainer />}
      <ConfirmBox />
      <Congratulation />
      <div className="relative max-w-screen min-h-screen mx-auto overflow-hidden">
        {!hideNavAndToTop && <NavigationBar />}
        {/* <Notification /> */}
        {/* {session && session.role === "admin" && <AdminDashboard />} */}
        {/* {session && session.role === "staff" && <StaffDashboard />} */}
        <div onClick={() => setOpenUserBox(false)}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route index path="/" element={<Home />}></Route>
              <Route path="/real+estate/signup" element={<SignUp />}></Route>
              <Route path="/real+estate/signin" element={<Login />}></Route>
              <Route path="/details" element={<Details />}></Route>
              {session && <Route path="/chat" element={<ChatBox />}></Route>}
              <Route
                path="/real+estate/your+profile"
                element={<Profile />}
              ></Route>
              <Route
                path="/real+estate/update+profile"
                element={<UpdateProfile />}
              ></Route>

              <Route
                path="/real+estate/search+result/*"
                element={<OptionResults />}
              ></Route>

              {/* 
              <Route path="/real+estate/post" element={<Post />}></Route>
              <Route
                path="/admin/list+of+posts"
                element={<ListOfPosts />}
              ></Route>
              <Route
                path="/admin/list+of+user+accounts"
                element={<AccountList />}
              ></Route>
              <Route
                path="/admin/list+of+feedbacks"
                element={<FeedbackList />}
              ></Route>
              <Route path="/admin/add+staff" element={<AddStaff />}></Route>
              <Route path="/admin" element={<GeneralInfo />}></Route>
              <Route
                path="/staff/list+posts+of+staff"
                element={<StaffPost />}
              ></Route>

              <Route path="/staff/update+post" element={<UpdatePost />}></Route>
              <Route
                path="/admin/list+of+staff+accounts"
                element={<StaffAccountsList />}
              ></Route>
              <Route path="/test" element={<Test />}></Route> */}
            </Routes>
          </AnimatePresence>
        </div>
        {/* {!hideNavAndToTop && <ToTop />} */}
        {session && session.role === "user" && <Footer />}
        <Sidebar />
      </div>
    </div>
  );
}

export default App;
