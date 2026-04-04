import { useEffect } from 'react'
import { Box, useColorMode } from '@chakra-ui/react'
import { useSlot } from '@/templates/context'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { colorMode } = useColorMode()
  const Navbar = useSlot('navbar')

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', colorMode)
    root.style.colorScheme = colorMode
    root.className = colorMode === 'dark' ? 'chakra-ui-dark' : 'chakra-ui-light'
  }, [colorMode])

  return (
    <Box minH="100vh" w="100vw" className={colorMode === 'dark' ? 'dark-theme' : ''}>
      <Navbar />
      <Box w="full" px={4}>
        {children}
      </Box>
    </Box>
  )
}

export default Layout
