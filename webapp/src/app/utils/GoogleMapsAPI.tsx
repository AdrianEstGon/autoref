import React from "react";
import { LoadScript } from "@react-google-maps/api";

const GoogleMapsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      {children}
    </LoadScript>
  );
};

export default GoogleMapsWrapper;
