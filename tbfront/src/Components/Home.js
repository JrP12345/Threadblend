import React from "react";
import "../Styles/Home.css";

import Slider from "./Slider";
import Trendingpicks from "./Trendingpicks";
import Toppicks from "./Toppicks";

const Home = () => {
  return (
    <>

    {/* make a new file in root folder firebase.js */}
    {/* import firebase from "firebase/compat/app";
import "firebase/compat/database";

// Your web app's Firebase configuration
const firebaseConfig = {
//  Add you Config here 
};
firebase.initializeApp(firebaseConfig);

const db = firebase.database();

export default db;
 */}
      <Slider />
      <Trendingpicks />
      <Toppicks />
    </>
  );
};

export default Home;
