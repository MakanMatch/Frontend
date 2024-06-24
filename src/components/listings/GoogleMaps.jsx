import { useState } from "react";
import { Box, Skeleton } from "@chakra-ui/react";
import { SlideFade } from "@chakra-ui/react";

const GoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <Box position="relative" width="100%" height="520px">
      {!isLoaded && (
        <Skeleton height="520px" width="100%" borderRadius="10px" />
      )}
      <SlideFade in={isLoaded} offsetY="20px">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.661186576997!2d103.84637377496578!3d1.3799499986070138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da16eb64b0249d%3A0xe5f10ff680eed942!2sNanyang%20Polytechnic!5e0!3m2!1sen!2ssg!4v1718990348359!5m2!1sen!2ssg"
          width="100%"
          height="520"
          style={{
            border: "0",
            borderRadius: "10px",
            display: isLoaded ? "block" : "none"
          }}
          allowFullScreen={true}
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={handleLoad}
        ></iframe>
      </SlideFade>
    </Box>
  );
};

export default GoogleMaps;
