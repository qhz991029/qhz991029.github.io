import { Box, VStack, Text, useColorModeValue, Image, HStack, Container, Link, Flex } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { withBase } from '@/utils/asset'
import DynamicIcon from '../DynamicIcon'
import { useTranslation } from 'react-i18next'
import { useLocalizedData } from '@/hooks/useLocalizedData'

const MotionText = motion(Text)

interface EducationItem {
  course: string
  institution: string
  year: string
}

// Hero Section Component
interface HeroSectionProps {
  title: string
  avatar: string
  education?: EducationItem[]
  educationLogos?: Record<string, string>
}

const BioLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} isExternal color="blue.500" _hover={{ textDecoration: 'underline' }}>{children}</Link>
)

const HeroSection = ({ title, avatar, education = [], educationLogos = {} }: HeroSectionProps) => {
  const { t } = useTranslation()
  const { siteOwner } = useLocalizedData()
  const headingColor = useColorModeValue('gray.800', 'white')
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const bg = useColorModeValue('gray.50', 'gray.900')
  const accentBg = useColorModeValue('blue.50', 'blue.900')
  const primaryEmail = siteOwner.contact.academicEmail || siteOwner.contact.email
  const contactLinks = [
    primaryEmail && { icon: 'FaEnvelope', label: 'email', href: `mailto:${primaryEmail}` },
    siteOwner.social.github && { icon: 'FaGithub', label: 'github', href: siteOwner.social.github },
    siteOwner.social.googleScholar && { icon: 'SiGooglescholar', label: 'scholar', href: siteOwner.social.googleScholar },
    siteOwner.social.linkedin && { icon: 'FaLinkedin', label: 'linkedin', href: siteOwner.social.linkedin },
    siteOwner.social.twitter && { icon: 'SiX', label: 'x', href: siteOwner.social.twitter },
    siteOwner.social.xiaohongshu && { icon: 'SiXiaohongshu', label: '小红书', href: siteOwner.social.xiaohongshu },
  ].filter(Boolean) as { icon: string; label: string; href: string }[]

  return (
    <Box
      w="full"
      bg={bg}
      py={[3, 4, 6]}
      mt={[2, 3, 4]}
    >
      <Container maxW={["full", "full", "7xl"]} px={[2, 4, 8]}>
        <VStack spacing={[2, 3]} align="flex-start" w="full">
            <MotionText
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              as="h1"
              fontSize={["lg", "xl", "3xl"]}
              fontWeight="bold"
              color={headingColor}
              lineHeight="shorter"
              mb={[1, 2, 3]}
              display="flex"
              alignItems="center"
              gap={[1, 2]}
              flexWrap={["wrap", "wrap", "nowrap"]}
              textAlign="left"
              w="full"
              sx={{
                justifyContent: "flex-start"
              }}
            >
              <MotionText
                as="span"
                color="yellow.400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                $
              </MotionText>
              <MotionText
                as="span"
                initial={{ width: 0 }}
                animate={{ width: "auto" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                overflow="hidden"
                whiteSpace="nowrap"
                display="inline-block"
              >
                {t('hero.greeting')}{' '}
              </MotionText>
              <MotionText
                as="span"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.6 }}
                color="cyan.400"
                fontFamily="mono"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <MotionText
                  as="span"
                  initial={{ width: 0 }}
                  animate={{ width: "auto" }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                  overflow="hidden"
                  whiteSpace="nowrap"
                >
                  {siteOwner.name.display}
                </MotionText>
              </MotionText>
            </MotionText>

            <Box w="full" borderTop="1px dashed" borderColor={useColorModeValue('gray.200', 'gray.700')} />

            {/* Avatar | Bio | Education — three columns on desktop */}
            {education.length > 0 && (
              <Flex direction={['column', 'column', 'row']} gap={[4, 4, 6]} align={['center', 'center', 'flex-start']} w="full">
                {/* Avatar */}
                <Box flexShrink={0}>
                  <Image
                    src={withBase(`images/${avatar}`)}
                    alt={title}
                    loading="eager"
                    borderRadius="xl"
                    boxSize={["150px", "180px", "200px"]}
                    objectFit="cover"
                    bg={useColorModeValue('gray.100', 'gray.700')}
                  />
                </Box>

                {/* Bio */}
                <Box flex={1} maxW={["full", "full", "380px"]}>
                  <Text
                    fontSize={["xs", "sm"]}
                    color={textColor}
                    lineHeight="tall"
                    textAlign="justify"
                  >
                    Huaizhi Qu is an incoming PhD student at <BioLink href="https://github.com/World-Mind-Lab">World Mind Lab</BioLink>, <BioLink href="https://cse.hkust.edu.hk/">HKUST</BioLink>, co-advised by Prof. <BioLink href="https://fnzhan.com/">Fangneng Zhan</BioLink> and Prof. <BioLink href="https://hongbofu.people.ust.hk/">Hongbo Fu</BioLink>. His research interests center on 3D vision, world models, large language models (LLMs), vision-language models (VLMs), and multimodal learning. He received his M.S. in Computer Science from <BioLink href="https://cs.unc.edu/">UNC Chapel Hill</BioLink> and his B.E. in Computer Science from <BioLink href="https://en.cs.ustc.edu.cn/main.htm">USTC</BioLink>.
                  </Text>
                </Box>

                {/* Education */}
                <VStack align="start" spacing={0} flexShrink={0} flex={1} justify="space-between" alignSelf="stretch">
                  {education.map((item, index) => {
                    const logo = educationLogos[item.institution]
                    const instInfo: Record<string, { abbr: string; url: string }> = {
                      'The Hong Kong University of Science and Technology': { abbr: 'HKUST', url: 'https://cse.hkust.edu.hk/' },
                      'University of North Carolina at Chapel Hill': { abbr: 'UNC Chapel Hill', url: 'https://cs.unc.edu/' },
                      'University of Science and Technology of China': { abbr: 'USTC', url: 'https://en.cs.ustc.edu.cn/main.htm' },
                    }
                    const inst = instInfo[item.institution]
                    return (
                      <HStack key={index} spacing={2.5} p={1.5} borderRadius="md">
                        {logo ? (
                          <Image src={logo} alt={item.institution} w="28px" h="28px" borderRadius="sm" objectFit="contain" flexShrink={0} />
                        ) : (
                          <Flex w="28px" h="28px" borderRadius="sm" bg={accentBg} align="center" justify="center" flexShrink={0}>
                            <Text fontSize="xs" fontWeight="bold" color="blue.500">{item.institution.charAt(0)}</Text>
                          </Flex>
                        )}
                        <VStack align="start" spacing={0}>
                          <Text fontSize={["xs", "sm"]} fontWeight="medium" lineHeight="short" color={headingColor}>
                            {item.course.includes('World Mind Lab') ? (
                              <>
                                {item.course.split('World Mind Lab')[0]}
                                <Link href="https://github.com/World-Mind-Lab" isExternal color="blue.500" _hover={{ textDecoration: 'underline' }}>World Mind Lab</Link>
                                {item.course.split('World Mind Lab')[1]}
                              </>
                            ) : item.course}
                          </Text>
                          <Text fontSize="xs" color={textColor} lineHeight="short">
                            {inst ? (
                              <><Link href={inst.url} isExternal color="blue.500" _hover={{ textDecoration: 'underline' }}>{inst.abbr}</Link> · {item.year}</>
                            ) : (
                              <>{item.institution} · {item.year}</>
                            )}
                          </Text>
                        </VStack>
                      </HStack>
                    )
                  })}
                </VStack>
              </Flex>
            )}

            <Box w="full" borderTop="1px dashed" borderColor={useColorModeValue('gray.200', 'gray.700')} />

            {/* Contact */}
            <Flex w="full" justify="flex-start">
              {contactLinks.length > 0 && (
                <HStack spacing={2} flexWrap="wrap" justify="flex-start">
                  {contactLinks.map((item, index) => (
                    <HStack key={item.label} spacing={2}>
                      {index > 0 && <Text color={textColor} opacity={0.2}>/</Text>}
                      <Link href={item.href} isExternal _hover={{ textDecoration: 'none' }}>
                        <HStack spacing={1.5} color={textColor} transition="all 0.15s" _hover={{ color: 'cyan.400' }}>
                          <DynamicIcon name={item.icon} boxSize={3.5} />
                          <Text fontSize="xs" fontFamily="mono">{item.label}</Text>
                        </HStack>
                      </Link>
                    </HStack>
                  ))}
                </HStack>
              )}
            </Flex>
        </VStack>
      </Container>
    </Box>
  )
}

export default HeroSection
