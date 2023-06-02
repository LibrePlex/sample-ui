import { extendTheme } from '@chakra-ui/react'
import { tabsTheme } from 'components/tabs/Tabs'


const theme = extendTheme({
  components: {
    Tabs: tabsTheme,
  },
})

export default theme