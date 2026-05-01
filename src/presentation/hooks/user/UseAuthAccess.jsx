import { useState, useEffect } from 'react';
import { tokenHelper } from "../../../infraestructure/storage/helpers/token.helpers.js";

export function UseAuthAccess() {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
   
  useEffect(() => {
   const handleAccess = async () => {
   const accessToken = tokenHelper.getAccessToken();
    setHasAccess(!!accessToken);
    setLoading(false);
   } 
   handleAccess(); 
  } , [])

  return { hasAccess , loading };
  
}

