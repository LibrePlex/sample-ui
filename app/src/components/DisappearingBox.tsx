

import { Box, BoxProps, Grid, chakra, shouldForwardProp } from "@chakra-ui/react";
import { isValidMotionProp, motion, useAnimation } from "framer-motion";
import { ReactNode, useContext, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const variants = {
  show: { opacity: 1, scale: 1, y: 0, x: 0, transition: { duration: 0.4 } },
  hidden: { opacity: 0, y: 20, x: 5, scale: 0.5 },
  
};


const ChakraBox = chakra(motion.div, {
    /**
     * Allow motion props and non-Chakra props to be forwarded.
     */
    shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
  });

export const DisappearingBox = ({
  children,
  allowSelection,
  selected,
  collageView,
  ...rest
}: {
  collageView?: boolean
  allowSelection?: boolean;
  selected?: boolean;
  children: ReactNode;
} & BoxProps) => {
  const { ref, inView, entry } = useInView({
    threshold: 0
  });
  
  const controls = useAnimation();
  useEffect(() => {
    if (inView) {
      controls.start("show");
    }
  }, [controls, inView]);

  // const { cardWidth, cardHeight, index } = props;

  return (
    <ChakraBox
      animate={controls}
      initial="hidden"
      variants={variants}
      ref={ref}
      // sx={{
      //   height: "90%"
      // }}
    >
      <Box
      {...rest}
        sx={{
          minWidth: 200,
          maxWidth: 200,
          height :'100%',
          // height: "100%",
          minHeight: 200,
          ...rest.sx
        }}
      >
        {inView && children}
      </Box>
    </ChakraBox>
  );
};
