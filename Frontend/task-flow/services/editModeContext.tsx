// import React, { createContext, useState, useContext } from 'react';

// type EditModeContextType = {
//   isEditing: boolean;
//   toggleEditMode: () => void;
// };

// export const EditModeContext = createContext<EditModeContextType>({
//   isEditing: false,
//   toggleEditMode: () => {},
// });

// export function EditModeProvider({ children }: { children: React.ReactNode }) {
//   const [isEditing, setIsEditing] = useState(false);
  
//   const toggleEditMode = () => setIsEditing(prev => !prev);
  
//   return (
//     <EditModeContext.Provider value={{ isEditing, toggleEditMode }}>
//       {children}
//     </EditModeContext.Provider>
//   );
// }

// export function useEditMode() {
//     return useContext<EditModeContextType>(EditModeContext);
// }

export default function Teste() {
    return <></>;
}