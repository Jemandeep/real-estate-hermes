// "use client";
// <<<<<<< Updated upstream
// import React, { useState, useEffect } from "react";
// =======
// export const dynamic = "force-dynamic";

// // import React, { useState, useEffect, useRef } from "react";
// // import { Box, Button, Typography } from "@mui/material";
// // import { getAuth, onAuthStateChanged } from "firebase/auth";
// // import {
// //   fetchUserProperties,
// //   fetchListings,
// //   fetchWatchlist,
// //   addToWatchlist,
// // } from "../components/firebaseUtils";
// // import { calculateMetrics } from "../components/calculateMetrics";
// // import Layout from "../components/Layout";
// // import StatsGrid from "../components/Overview";
// // import LtvRatio from "../components/LtvRatio";
// // import AverageMortgage from "../components/AverageMortgage";
// // import RentalIncomeExpenses from "../components/RentalIncomeExpenses";
// // import ListingCard from "../components/ListingCard";

// // // 1) Dynamically import the map component, disabling SSR
// // import NextDynamic from "next/dynamic";
// // const MapComponent = NextDynamic(() => import("../components/MapComponent"), {
// //   ssr: false,
// // });

// // import AnalysisSidebar from "../components/AnalysisSidebar";

// // const Analysis = () => {
// //   const [userProperties, setUserProperties] = useState([]);
// //   const [listings, setListings] = useState([]);
// //   const [error, setError] = useState(null);
// //   const [metrics, setMetrics] = useState({
// //     totalInvestment: 0,
// //     currentPortfolioValue: 0,
// //     roi: 0,
// //     cashFlow: 0,
// //   });

// //   const auth = getAuth();
// //   const mainContentRef = useRef(null); // Ref for the main content area
// //   const [sidebarHeight, setSidebarHeight] = useState("auto");

// //   // Fetch user properties and listings on auth change
// //   useEffect(() => {
// //     const unsubscribe = onAuthStateChanged(auth, async (loggedUser) => {
// //       if (loggedUser) {
// //         try {
// //           const properties = await fetchUserProperties(loggedUser.email);
// //           setUserProperties(properties);
// //           setMetrics(calculateMetrics(properties));

// //           const fetchedListings = await fetchListings();
// //           setListings(fetchedListings);
// //         } catch (err) {
// //           console.error(err);
// //         }
// //       }
// //     });
// //     return () => unsubscribe();
// //   }, [auth]);

//   // Handle watchlist addition
//   const handleAddToWatchlist = async (listing) => {
//     if (!user) {
//       alert("You need to be logged in to add properties to your watchlist.");
//       return;
//     }
//     try {
//       await addToWatchlist(user.email, listing.id);
//       setWatchlist((prev) => [...prev, listing.id]);
//       alert(`Added ${listing.address} to your watchlist.`);
//     } catch (error) {
//       alert("Error adding to watchlist.");
//     }
//   };
// <<<<<<< Updated upstream

//   return (
//     <Layout>
//       <div className="min-h-screen bg-blue-gray-50/50 p-6">
//         {/* Page Header */}
//         <h1 className="text-3xl font-semibold mb-6 text-gray-800">
//           Your Property Portfolio
//         </h1>
  
//         {/* Metrics Overview */}
//         <div className="mb-8">
//           <StatsGrid metrics={metrics} />
//         </div>
  
// {/* Main Charts Section */}
// <div className="grid grid-cols-4 gap-6 mb-12"> {/* Adds margin below the section */}
//   {/* LTV Ratio */}
//   <div className="col-span-1 h-[50vh]">
//     <LtvRatio userProperties={userProperties} />
//   </div>

//   {/* Average Mortgage */}
//   <div className="col-span-1 h-[50vh]">
//     <AverageMortgage userProperties={userProperties} />
//   </div>

//   {/* Empty Space */}
//   <div className="col-span-2"></div>
// </div>

// {/* Rental Income and Expenses Section */}
// <div className="mt-12"> {/* Adds margin to avoid overlap */}
//   <RentalIncomeExpenses userProperties={userProperties} />
// </div>

  
//         {/* Public Listings Section */}
//         <div className="mt-8">
//           <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//             <h3 className="text-xl font-semibold mb-4 text-gray-700">
//               Public Listings
//             </h3>
//             <div className="max-h-96 overflow-y-auto space-y-4">
//               {error ? (
//                 <p className="text-red-600">{error}</p>
//               ) : (
//                 listings.map((listing) => (
//                   <div
//                     key={listing.id}
//                     className="bg-gray-100 p-4 rounded-lg shadow-sm"
//                   >
//                     <ListingCard {...listing} />
//                     <button
//                       onClick={() => handleAddToWatchlist(listing)}
//                       className="mt-2 text-blue-500 hover:underline"
//                     >
//                       Add to Watchlist
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
// =======

//   // Dynamically adjust sidebar height
//   useEffect(() => {
//     const updateSidebarHeight = () => {
//       if (mainContentRef.current) {
//         const height = mainContentRef.current.offsetHeight;
//         setSidebarHeight(height);
//       }
//     };

//     // Only attach the listener if window is available
//     if (typeof window !== "undefined") {
//       updateSidebarHeight();
//       window.addEventListener("resize", updateSidebarHeight);
//     }

//     return () => {
//       if (typeof window !== "undefined") {
//         window.removeEventListener("resize", updateSidebarHeight);
//       }
//     };
//   }, [userProperties, listings]);

//   return (
//     <Layout>
//       <Box
//         display="flex"
//         gap="20px"
//         sx={{
//           transform: "scale(0.7)",
//           transformOrigin: "top center",
//           height: "containerHeight",
//         }}
//       >
//         {/* Sidebar Section */}
//         <AnalysisSidebar sidebarHeight={sidebarHeight} />

//         {/* Main Content */}
//         <Box flexGrow={1} display="flex" flexDirection="column" ref={mainContentRef}>
//           {/* Overview Section */}
//           <Box mt="20px" paddingTop="30px">
//             <StatsGrid metrics={metrics} />
//           </Box>

//           {/* Content Rows */}
//           <Box
//             display="grid"
//             gridTemplateColumns="repeat(12, 1fr)"
//             gap="20px"
//             mt="20px"
//             sx={{ gridAutoRows: "minmax(auto, max-content)" }}
//             flexGrow={1}
//           >
//             {/* Rental Income & Expenses */}
//             <Box
//               gridColumn="span 8"
//               backgroundColor="#fff"
//               borderRadius="8px"
//               padding="20px"
//             >
//               <RentalIncomeExpenses userProperties={userProperties} />
//             </Box>

//             {/* Public Listings */}
//             <Box
//               gridColumn="span 4"
//               backgroundColor="#fff"
//               borderRadius="8px"
//               padding="20px"
//               flex="1"
//               sx={{
//                 overflowY: "auto",
//                 "::-webkit-scrollbar": { width: "0px" },
//                 msOverflowStyle: "none",
//                 scrollbarWidth: "none",
//               }}
//             >
//               <Typography variant="h5" fontWeight="600" mb="10px" color="#333">
//                 Public Listings
//               </Typography>
//               <Box>
//                 {listings.length > 0 ? (
//                   listings.slice(0, 6).map((listing, index) => (
//                     <Box
//                       key={`${listing.id}-${index}`}
//                       display="flex"
//                       justifyContent="space-between"
//                       alignItems="center"
//                       borderBottom="4px solid #ddd"
//                       p="15px"
//                     >
//                       <Box>
//                         <Typography variant="subtitle2" fontWeight="500">
//                           {listing.address}
//                         </Typography>
//                         <Typography variant="caption" color="textSecondary">
//                           {listing.neighborhood}
//                         </Typography>
//                       </Box>
//                       <Box textAlign="right">
//                         <Typography variant="caption" color="textSecondary">
//                           Current Price:
//                         </Typography>
//                         <Typography variant="subtitle2" fontWeight="500">
//                           {listing.current_price
//                             ? `$${parseFloat(listing.current_price).toLocaleString()}`
//                             : "Price not available"}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   ))
//                 ) : (
//                   <Typography color="textSecondary">No listings available.</Typography>
//                 )}
//               </Box>
//             </Box>

//             {/* Row 2: LTV Ratio, Average Mortgage, and Map */}
//             <Box
//               gridColumn="span 4"
//               backgroundColor="#fff"
//               borderRadius="8px"
//               p="20px"
//             >
//               <LtvRatio userProperties={userProperties} />
//             </Box>
//             <Box
//               gridColumn="span 4"
//               backgroundColor="#fff"
//               borderRadius="8px"
//               p="20px"
//             >
//               <AverageMortgage userProperties={userProperties} />
//             </Box>
//             <Box
//               gridColumn="span 4"
//               backgroundColor="#fff"
//               borderRadius="8px"
//               p="20px"
//             >
//               {/* Dynamically-imported Map Component */}
//               <MapComponent />
//             </Box>
//           </Box>
//         </Box>
//       </Box>
// >>>>>>> Stashed changes
//     </Layout>
//   );
  
  
// }
  
// export default Analysis;
