// import React, { createContext, use, useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// export const AppContext = createContext();

// const AppContextProvider = (props) => {
//     const backendUrl = import.meta.env.VITE_BACKEND_URL;

//     const [token, setToken] = useState(localStorage.getItem("token") || null);
//     const [userData, setUserData] = useState(()=>{
//         const storedUser = localStorage.getItem('user');
//         return storedUser ? JSON.parse(storedUser) : null
//     });
//     const [mangaMarked, setMangaMarked] = useState([]);
//     const [mangas, setMangas] = useState(() => {
//         const storedMangas = localStorage.getItem('mangas');
//         return storedMangas ? JSON.parse(storedMangas) : [];
//     });


//     const loadUserData = async () => {
//         if (!token) return;
//         try {
//             const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
//                 headers: { token }  
//             });

//             if (data.success) {
//                 setUserData(data.userData);
//                 localStorage.setItem('user', JSON.stringify(data.userData));
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || error.message);
//         }
//     };

//     const updateToken = (newToken) => {
//         setToken(newToken);
//         if (newToken) {
//             localStorage.setItem("token", newToken);
//             loadUserData(); // Pass newToken to avoid outdated value
//         } else {
//             localStorage.removeItem("token");
//             setUserData(null);
//         }
//     };

//     const getManga = async () => {
//         try {
//             const { data } = await axios.get(`${backendUrl}/api/admin/all-manga`)
//             if (data.success) {
//                 setMangas(data.mangas)
//                 localStorage.setItem('mangas', JSON.stringify(data.mangas));
//             } else {
//                 toast.error(data.message)
//             }

//         } catch (error) {
//             toast.error(error.message)
//         }
//     }

//     const refreshMangas = async () => {
//         localStorage.removeItem('mangas'); // Clear localStorage
//         await getManga(); // Fetch fresh data
//     };

//     const getBookedManga = async () => {
//         try {
//             if (userData) {
//                 const userId = userData._id;
//                 const { data } = await axios.get(`${backendUrl}/api/user/booked-manga`, { params: { userId }, headers: { token } })
//                 console.log(data.mangaData);
//                 if (data.success) {
//                     setMangaMarked(data.mangaData);
//                     console.log(data);
//                 } else {
//                     console.log(data.message);
//                     toast.error(data.message);
//                 }
//             }
//         } catch (error) {
//             console.log(error.message);
//             toast.error(error.message);
//         }
//     };
//     // Fetch user data when token changes
//     useEffect(() => {
//         if (token) {
//             loadUserData();
//         }
//     }, [token]);
//     useEffect(() => {
//         getManga()
//     }, [])
//     const value = {
//         backendUrl,
//         token,
//         setToken: updateToken,
//         userData,
//         setUserData,
//         loadUserData,
//         mangas,
//         refreshMangas,
//         getManga,
//         mangaMarked, setMangaMarked,
//         getBookedManga
//     };

//     return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
// };

// export default AppContextProvider;


import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  // Backend URL from .env
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // -------------------------------
  // STATES
  // -------------------------------

  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const [userData, setUserData] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [mangas, setMangas] = useState([]); // Always fresh from DB
  const [mangaMarked, setMangaMarked] = useState([]);

  // -------------------------------
  // LOAD USER PROFILE
  // -------------------------------

  const loadUserData = async () => {
    if (!token) return;

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/profile`,
        {
          headers: { token },
        }
      );

      if (data.success) {
        setUserData(data.userData);
        localStorage.setItem("user", JSON.stringify(data.userData));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // -------------------------------
  // TOKEN UPDATE FUNCTION
  // -------------------------------

  const updateToken = (newToken) => {
    setToken(newToken);

    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUserData(null);
    }
  };

  // -------------------------------
  // FETCH ALL MANGAS (Fresh from DB)
  // -------------------------------

  const getManga = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/all-manga`
      );

      if (data.success) {
        setMangas(data.mangas);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to load mangas!");
      console.log(error.message);
    }
  };

  // -------------------------------
  // REFRESH MANGA LIST
  // -------------------------------

  const refreshMangas = async () => {
    await getManga();
  };

  // -------------------------------
  // FETCH BOOKED MANGAS
  // -------------------------------

  const getBookedManga = async () => {
    if (!userData) return;

    try {
      const userId = userData._id;

      const { data } = await axios.get(
        `${backendUrl}/api/user/booked-manga`,
        {
          params: { userId },
          headers: { token },
        }
      );

      if (data.success) {
        setMangaMarked(data.mangaData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to load booked mangas!");
      console.log(error.message);
    }
  };

  // -------------------------------
  // USE EFFECTS
  // -------------------------------

  // Load user profile when token changes
  useEffect(() => {
    if (token) {
      loadUserData();
    }
  }, [token]);

  // Load mangas once when app starts
  useEffect(() => {
    getManga();
  }, []);

  // -------------------------------
  // CONTEXT VALUE
  // -------------------------------

  const value = {
    backendUrl,

    token,
    setToken: updateToken,

    userData,
    setUserData,
    loadUserData,

    mangas,
    getManga,
    refreshMangas,

    mangaMarked,
    setMangaMarked,
    getBookedManga,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
