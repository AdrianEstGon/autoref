import React from "react";
import { LoadScript } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyC24LaFVU6RgtEswKeAvrryUFBg7CBgONQ";

const GoogleMapsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      {children}
    </LoadScript>
  );
};

export default GoogleMapsWrapper;
