import { tabsAnatomy } from "@chakra-ui/anatomy";
import {
  Tabs,
  TabsProps,
  createMultiStyleConfigHelpers,
} from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools"; // import utility to set light and dark mode props

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

// define a custom variant
const colorfulVariant = definePartsStyle((props) => {
  const { colorScheme: c } = props; // extract colorScheme from component props

  return {
    tab: {
      border: "2px solid",
      minWidth :"200px",
      borderColor: "transparent",
      // use colorScheme to change background color with dark and light mode options
      bg: mode(`${c}.100`, `${c}.600`)(props),
      // borderTopRadius: "lg",
      borderBottom: "none",
      _selected: {
        bg: mode("#fff", "gray.800")(props),
        color: mode(`${c}.500`, `${c}.300`)(props),
        borderColor: "inherit",
        borderBottom: "none",
        mb: "-2px",
      },
    },
    tablist: {
      borderBottom: "2x solid",
      borderColor: "inherit",
    },
    tabpanel: {
      border: "2px solid",
      borderColor: "inherit",
      // borderBottomRadius: "lg",
      // borderTopRightRadius: "lg",
    },
  };
});

const variants = {
  colorful: colorfulVariant,
};

// export the component theme
export const tabsTheme = defineMultiStyleConfig({ variants });

// now we can use the `colorful` variant with a different color Scheme
export const StyledTabs = (props: TabsProps) => (
  <Tabs variant="colorful" colorScheme="purple" {...props} />
);
