import {
  Box, Flex, IconButton, useColorMode, HStack, Link as ChakraLink, Image,
  useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody,
  VStack, Divider
} from '@chakra-ui/react'
import { MoonIcon, SunIcon, HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { navItems } from '@/site.config'

const Navbar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const location = useLocation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { t } = useTranslation()

  return (
    <Box
      as="nav"
      py={4}
      borderBottom="1px solid"
      borderColor="var(--border-color)"
      position="sticky"
      top={0}
      bg="var(--bg-color)"
      zIndex={1000}
      w="full"
    >
      <Flex
        justify="space-between"
        align="center"
        w="full"
        px={4}
        position="relative"
      >
        {/* Mobile: hamburger */}
        <Box display={{ base: 'block', md: 'none' }}>
          <IconButton
            aria-label={t('aria.openNav')}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            onClick={isOpen ? onClose : onOpen}
            variant="ghost"
            color="var(--text-color)"
          />
        </Box>

        {/* Desktop: logo left */}
        <ChakraLink
          as={Link}
          to="/"
          display={{ base: 'none', md: 'flex' }}
          alignItems="center"
          _hover={{ opacity: 0.85 }}
          transition="opacity 0.15s"
        >
          <Image
            src={`${import.meta.env.BASE_URL}logo-icon.svg`}
            alt="TermHub"
            h="28px"
            w="28px"
          />
        </ChakraLink>

        {/* Desktop nav (right aligned) */}
        <HStack
          spacing={8}
          display={{ base: 'none', md: 'flex' }}
          ml="auto"
          mr={{ base: 0, md: 6 }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  color: 'var(--text-color)',
                  textDecoration: 'none',
                  borderBottom: isActive ? '2px solid var(--accent-color)' : 'none',
                  paddingBottom: '2px',
                  fontSize: '1rem',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.2s'
                }}
              >
                {t(item.labelKey)}
              </Link>
            )
          })}
        </HStack>
        <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
          <IconButton
            aria-label={t('aria.toggleColorMode')}
            icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            color="var(--text-color)"
            _hover={{
              bg: 'var(--hover-color)',
              transform: 'translateY(-2px)'
            }}
            transition="all 0.2s"
          />
        </HStack>
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="var(--bg-color)">
          <DrawerHeader color="var(--text-color)">{t('nav.navigation')}</DrawerHeader>
          <DrawerBody>
            <VStack align="stretch" spacing={3}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <ChakraLink
                    key={item.path}
                    as={Link}
                    to={item.path}
                    onClick={onClose}
                    color={isActive ? 'var(--accent-color)' : 'var(--text-color)'}
                    _hover={{ color: 'var(--accent-color)' }}
                    fontWeight={isActive ? 600 : 400}
                  >
                    {t(item.labelKey)}
                  </ChakraLink>
                )
              })}

              <Divider borderColor="var(--border-color)" my={2} />

              <IconButton
                aria-label={t('aria.toggleColorMode')}
                icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
                onClick={toggleColorMode}
                variant="outline"
                color="var(--text-color)"
              />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default Navbar
