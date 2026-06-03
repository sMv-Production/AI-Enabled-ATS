import { createContext, useContext } from 'react';

const DataContext = createContext(null);
const DataProvider = DataContext.Provider; 
const useDataContext = () => useContext(DataContext);

// ({ children }) => {
//   const [data, setData] = useState(null);

//   return (
//     <DataContext.Provider value={{ data, setData }}>
//       {children}
//     </DataContext.Provider>
//   );
// };

export { DataContext, DataProvider, useDataContext };