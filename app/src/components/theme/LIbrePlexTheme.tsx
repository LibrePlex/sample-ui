import { extendTheme } from '@chakra-ui/react'
import { tabsTheme } from 'components/tabs/Tabs'


const theme = extendTheme({
  semanticTokens: {
    colors: {
      'chakra-body-text': {
        _light: '#efefef',
        _dark: '#efefef',
      },
      'chakra-text': {
        _light: '#f8f8f8',
        _dark: '#f8f8f8',
      }
    }
  },
  components: {
    Tabs: tabsTheme,
    
  },
})

export default theme