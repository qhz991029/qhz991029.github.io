import { Icon } from '@chakra-ui/react'
import { IconType } from 'react-icons'
import { FaGithub, FaLinkedin, FaMedium, FaEnvelope, FaYoutube, FaHeart, FaCode, FaClock, FaArrowRight, FaGlobe, FaExternalLinkAlt, FaFileAlt, FaRocket, FaDatabase, FaChartBar, FaProjectDiagram, FaChalkboardTeacher, FaRobot, FaPlay, FaChevronRight, FaTrophy, FaPlane, FaGraduationCap, FaMedal, FaBriefcase, FaLightbulb, FaAward, FaCoins, FaStar, FaUser, FaFolder, FaCodeBranch, FaBolt, FaCoffee, FaBrain, FaTerminal, FaMapMarkerAlt } from 'react-icons/fa'
import { SiGooglescholar, SiBilibili, SiX, SiCsdn, SiZhihu, SiNotion, SiArxiv, SiXiaohongshu } from 'react-icons/si'

const icons: { [key: string]: IconType } = {
  FaGithub,
  FaLinkedin,
  FaMedium,
  FaEnvelope,
  FaYoutube,
  FaHeart,
  FaCode,
  FaClock,
  FaArrowRight,
  FaGlobe,
  FaExternalLinkAlt,
  FaFileAlt,
  FaRocket,
  FaDatabase,
  FaChartBar,
  FaProjectDiagram,
  FaChalkboardTeacher,
  FaRobot,
  SiGooglescholar,
  SiBilibili,
  SiX,
  SiCsdn,
  SiZhihu,
  SiNotion,
  SiArxiv,
  SiXiaohongshu,
  FaPlay,
  FaChevronRight,
  FaTrophy,
  FaPlane,
  FaGraduationCap,
  FaMedal,
  FaBriefcase,
  FaLightbulb,
  FaAward,
  FaCoins,
  FaStar,
  FaUser,
  FaFolder,
  FaCodeBranch,
  FaBolt,
  FaCoffee,
  FaBrain,
  FaTerminal,
  FaMapMarkerAlt,
}

interface DynamicIconProps {
  name?: string
  color?: string
  boxSize?: number | number[] | string | string[]
  [key: string]: any
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  if (!name) return null
  const IconComponent = icons[name] || FaCode
  return <Icon as={IconComponent} {...props} />
}

export default DynamicIcon 
