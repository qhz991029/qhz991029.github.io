import { Box, Container, Text, Heading, Flex, Link } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useLocalizedData } from '@/hooks/useLocalizedData'

/** Parse [link](url) markers in text */
const renderLinkedText = (text: string) => {
  const parts = text.split(/(\[.*?\]\(.*?\))/g)
  return parts.map((part, i) => {
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/)
    if (linkMatch) {
      return <Link key={i} href={linkMatch[2]} isExternal color="cyan.400" _hover={{ textDecoration: 'underline' }}>{linkMatch[1]}</Link>
    }
    return <Text as="span" key={i}>{part}</Text>
  })
}

const BioSection: React.FC = () => {
  const { t } = useTranslation()
  const { about } = useLocalizedData()
  const textColor = 'var(--secondary-text)'

  if (!about.journey) return null

  return (
    <Box w="full">
      <Container maxW={["full", "full", "7xl"]} px={[2, 4, 8]}>
        <Flex align="center" gap={3} mb={4}>
          <Box h="2px" w="20px" bg="cyan.400" borderRadius="full" flexShrink={0} />
          <Heading size="md" fontWeight="semibold">{t('about.bio', 'About')}</Heading>
          <Box flex="1" h="1px" bg="var(--border-color)" />
        </Flex>
        <Text fontSize="sm" lineHeight="tall" color={textColor}>
          {renderLinkedText(about.journey)}
        </Text>
      </Container>
    </Box>
  )
}

export default BioSection
