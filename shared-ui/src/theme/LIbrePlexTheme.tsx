import { extendTheme, withDefaultColorScheme, type ThemeConfig } from '@chakra-ui/react'


const theme = extendTheme({
  // initialColorMode: 'dark',
  useSystemColorMode: false,
  semanticTokens: {
    colors: {
      'chakra-body-text': {
        _light: '#efefef',
        _dark: '#efefef',
      },
      'chakra-text': {
        _light: '#f8f8f8',
        _dark: '#f8f8f8',
      },
      'modal-bg': {
        _light: '#eee',
        _dark: '#222',
      }
    }
  },
  components: {
    Modal: {
      baseStyle: {
        dialog: {
          bg: "#222"
        }
      }
    },
    Alert: {
      baseStyle: {
        div: {
          color: "red"
        }
      }
    }
    
  },
})


// const config: ThemeConfig = {
//   initialColorMode: 'light',
//   useSystemColorMode: false,
//   // colorScheme: 'red'
// };

// const theme = extendTheme(config);

export default theme