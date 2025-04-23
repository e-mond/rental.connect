
// import { useEffect, useState } from "react";
// import { useLocation, useNavigation } from "react-router-dom";

// /**
//  * GlobalLoader component displays a loading animation during navigation.
//  */
// const GlobalLoader = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const location = useLocation();
//   const navigation = useNavigation();

//   useEffect(() => {
//     if (navigation.state === "loading") {
//       setIsLoading(true);

//       // Ensure the loader shows for at least 500ms for a smooth transition
//       const timeout = setTimeout(() => {
//         setIsLoading(false);
//       }, 500);

//       return () => clearTimeout(timeout);
//     }
//   }, [navigation.state]);

//   if (!isLoading) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
//       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
//     </div>
//   );
// };

// export default GlobalLoader;
