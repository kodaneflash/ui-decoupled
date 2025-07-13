import React from "react";
import FaceID from "../icons/FaceID";
import FaceIDFailed from "../icons/FaceIDFailed";

interface Props {
  biometricsType?: string | null;
  failed?: boolean;
  size?: number;
  color?: string;
}

const BiometricsIcon: React.FC<Props> = ({ biometricsType, failed, ...props }) => {
  // Since we're only supporting Face ID, we'll default to Face ID
  if (biometricsType === "FaceID" || !biometricsType) {
    return failed ? <FaceIDFailed {...props} /> : <FaceID {...props} />;
  }

  return null;
};

export default BiometricsIcon; 