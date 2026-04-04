import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Box, HStack, Text, Link, Flex, useColorMode, Collapse } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import DynamicIcon from '../DynamicIcon'
import { NewsItem } from '../../types'
import { highlightData } from '../../utils/highlightData'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { terminalPalette } from '@/config/theme'

interface NewsTimelineProps {
  news: NewsItem[]
  showHeader?: boolean
}

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const rainbow = keyframes`
  0% { color: #bf616a; }
  17% { color: #d08770; }
  33% { color: #ebcb8b; }
  50% { color: #a3be8c; }
  67% { color: #88c0d0; }
  83% { color: #b48ead; }
  100% { color: #bf616a; }
`;

// Format date to YYYY-MM-DD
const formatDate = (dateString: string = ""): string => {
  if (!dateString) return "0000-00-00";

  // Simple conversion for dates like "Jan 2023"
  const months: Record<string, string> = {
    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
    'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
  };

  const parts = dateString.split(' ');
  if (parts.length === 2 && months[parts[0]]) {
    return `${parts[1]}-${months[parts[0]]}-01`;
  }

  return dateString;
};

// Truncate text with ellipsis
const truncateText = (text: string, maxLength: number): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

// Terminal "processes" for status bar (like -zsh • -zsh)
const termProcesses = [
  "-research • -coffee",
  "-writing • -thinking",
  "-training • -debugging",
  "-reading • -caffeine",
];

// Research process statuses - cycles in title bar
const researchStatuses = [
  { label: "PAPER.ACCEPTED", suffix: "✓", colorKey: "success" },
  { label: "MODEL.TRAINING", suffix: "▓▓░", colorKey: "command" },
  { label: "IDEA.BREWING", suffix: "☕", colorKey: "param" },
  { label: "DEADLINE.CRUNCH", suffix: "⚡", colorKey: "warning" },
  { label: "REVIEW.PENDING", suffix: "⏳", colorKey: "highlight" },
  { label: "CODE.SHIPPING", suffix: "📦", colorKey: "info" },
];

// Responsive column widths — CSS media queries, no JS evaluation needed
const COL_DATE = { base: "70px", sm: "100px", md: "120px" };
const COL_TYPE = { base: "60px", sm: "80px", md: "100px" };
const COL_ID = { base: "60px", sm: "70px", md: "80px" };
const COL_CTRL = { base: "30px", sm: "40px", md: "50px" };

const NewsTimeline: React.FC<NewsTimelineProps> = ({ news, showHeader: _showHeader = false }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const { t } = useTranslation();
  const { siteOwner, publications } = useLocalizedData();

  // Build paper name → URL map from publications for linkifying descriptions
  const paperLinkMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (publications) {
      for (const pub of publications) {
        const url = pub.links.arxiv || pub.links.paper || pub.links.projectPage;
        if (!url) continue;
        // 1. Short name from title before ":"
        const colonIdx = pub.title.indexOf(':');
        if (colonIdx > 0) {
          map[pub.title.substring(0, colonIdx).trim()] = url;
        }
        // 2. Full title
        map[pub.title] = url;
        // 3. For titles without ":", find the longest prefix that ends before
        //    a common stop word (for, in, of, with, via, using, a, an, the, and)
        if (colonIdx <= 0) {
          const stop = /^(for|in|of|with|via|using|a|an|the|and)$/i;
          const words = pub.title.replace(/^\(.*?\)\s*/, '').split(' ');
          let cutoff = words.length;
          for (let i = 1; i < words.length; i++) {
            if (stop.test(words[i])) { cutoff = i; break; }
          }
          if (cutoff >= 2 && cutoff < words.length) {
            map[words.slice(0, cutoff).join(' ')] = url;
          }
        }
      }
    }
    return map;
  }, [publications]);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  // Interactive elements state
  const [researchStatusIndex, setResearchStatusIndex] = useState(0);
  const [processIndex, setProcessIndex] = useState(0);
  const [interactions, setInteractions] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(72);

  // Handle system interaction
  const handleSystemInteraction = useCallback(() => {
    setInteractions(prev => {
      const next = prev + 1;
      if (next % 3 === 0) {
        setResearchStatusIndex(p => (p + 1) % researchStatuses.length);
        setMemoryUsage(p => Math.min(95, p + 5));
      }
      return next;
    });
  }, []);

  // Single consolidated interval for all timers
  useEffect(() => {
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      setCurrentTime(new Date());
      if (tick % 6 === 0) setResearchStatusIndex(p => (p + 1) % researchStatuses.length);
      if (tick % 8 === 0) setProcessIndex(p => (p + 1) % termProcesses.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Toggle expanded state for an item
  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));

    // Trigger system interaction when expanding/collapsing
    handleSystemInteraction();
  };

  // Terminal palette from centralized config
  const tc = terminalPalette.colors(isDark);
  const termBg = tc.bg;
  const termText = tc.text;
  const termHeader = tc.header;
  const termBorder = tc.border;
  const termPrompt = tc.prompt;
  const termCommand = tc.command;
  const termParam = tc.param;
  const termInfo = tc.info;
  const termHighlight = tc.highlight;
  const termError = tc.error;
  const termSuccess = tc.success;
  const termWarning = tc.warning;
  const termSecondary = tc.secondary;

  // Linkify paper names in description text
  const linkifyDescription = useCallback((text: string, colors: { num: string; kw: string; str: string }) => {
    if (!text) return null;
    const names = Object.keys(paperLinkMap).sort((a, b) => b.length - a.length);
    if (names.length === 0) return highlightData(text, colors);

    const escaped = names.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const rx = new RegExp(`(${escaped.join('|')})`, 'g');

    const parts: React.ReactNode[] = [];
    let last = 0;
    let key = 0;
    let m: RegExpExecArray | null;

    while ((m = rx.exec(text)) !== null) {
      if (m.index > last) {
        parts.push(<React.Fragment key={key++}>{highlightData(text.slice(last, m.index), colors)}</React.Fragment>);
      }
      const url = paperLinkMap[m[0]];
      parts.push(
        <Link key={key++} href={url} isExternal color={termCommand} fontWeight="medium" _hover={{ textDecoration: 'underline', color: termHighlight }} onClick={(e) => e.stopPropagation()}>
          {m[0]}
        </Link>
      );
      last = m.index + m[0].length;
    }

    if (last < text.length) {
      parts.push(<React.Fragment key={key++}>{highlightData(text.slice(last), colors)}</React.Fragment>);
    }
    return <>{parts}</>;
  }, [paperLinkMap, termCommand, termHighlight]);

  // Type colors (for ANSI-like color coding)
  const typeColors: Record<string, { bg: string, fg: string, icon: string }> = {
    publication: {
      bg: isDark ? 'rgba(136, 192, 208, 0.15)' : 'rgba(42, 118, 156, 0.1)',
      fg: tc.command,
      icon: 'FaFileAlt'
    },
    talk: {
      bg: isDark ? 'rgba(208, 135, 112, 0.15)' : 'rgba(179, 90, 46, 0.1)',
      fg: tc.warning,
      icon: 'FaChalkboardTeacher'
    },
    course: {
      bg: isDark ? 'rgba(180, 142, 173, 0.15)' : 'rgba(154, 86, 162, 0.1)',
      fg: tc.param,
      icon: 'FaGraduationCap'
    },
    release: {
      bg: isDark ? 'rgba(163, 190, 140, 0.15)' : 'rgba(54, 128, 90, 0.1)',
      fg: tc.prompt,
      icon: 'FaRocket'
    },
    default: {
      bg: isDark ? 'rgba(163, 190, 140, 0.15)' : 'rgba(54, 128, 90, 0.1)',
      fg: tc.prompt,
      icon: 'FaCode'
    }
  };

  // Format the time as HH:MM:SS in the configured timezone
  const bostonTime = new Date(currentTime.toLocaleString("en-US", {timeZone: siteOwner.timezone}));
  const formattedTime = bostonTime.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Status bar: date + scrolling sparkline
  const bostonDateStr = `${bostonTime.getMonth() + 1}/${bostonTime.getDate()}`;
  const sparkChars = "▁▂▃▅▆▇▆▅▃▂▁▃▅▇▅▃";
  const sparkOffset = Math.floor(currentTime.getTime() / 1000) % sparkChars.length;
  const sparkDisplay = (sparkChars + sparkChars).slice(sparkOffset, sparkOffset + 8);

  // Description text with [+more] indicator for wide screens
  const getDescriptionText = useCallback((description: string) => {
    if (!description) return "";
    const maxLength = 60;
    if (description.length > maxLength) {
      const truncated = truncateText(description, maxLength);
      const withoutEllipsis = truncated.endsWith('...')
        ? truncated.slice(0, -3)
        : truncated;
      return (
        <>
          {withoutEllipsis}{' '}
          <Box as="span" color={termCommand} fontWeight="medium" display="inline">
            {t('newsTimeline.more')}
          </Box>
        </>
      );
    }
    return description;
  }, [termCommand]);

  // Interaction tier for title bar right side
  const interactionTier = interactions >= 25 ? { label: t('interactionTier.singularity'), isRainbow: true, color: termHighlight }
    : interactions >= 18 ? { label: t('interactionTier.overclocked'), isRainbow: false, color: termWarning }
    : interactions >= 12 ? { label: t('interactionTier.deepFocus'), isRainbow: false, color: termParam }
    : interactions >= 8 ? { label: t('interactionTier.engaged'), isRainbow: false, color: termSuccess }
    : interactions >= 5 ? { label: t('interactionTier.curious'), isRainbow: false, color: termCommand }
    : interactions >= 2 ? { label: t('interactionTier.scanning'), isRainbow: false, color: termInfo }
    : { label: t('interactionTier.idle'), isRainbow: false, color: termSecondary };

  // Current research status with resolved color
  const currentResearch = researchStatuses[researchStatusIndex];
  const researchColor = currentResearch.colorKey === "success" ? termSuccess
    : currentResearch.colorKey === "command" ? termCommand
    : currentResearch.colorKey === "param" ? termParam
    : currentResearch.colorKey === "warning" ? termWarning
    : currentResearch.colorKey === "highlight" ? termHighlight
    : termInfo;

  return (
    <Box
      w="full"
      overflow="hidden"
      borderRadius="md"
      fontFamily="mono"
      boxShadow={`0 0 0 1px ${termBorder}, 0 2px 8px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.08)'}`}
      letterSpacing="tight"
      display="flex"
      flexDirection="column"
    >
      {/* ═══ Pixel RGB light bar (dynamic chase) ═══ */}
      <Flex
        h="4px"
        w="full"
        flexShrink={0}
        borderTopRadius="md"
        overflow="hidden"
      >
        {(() => {
          const total = 28;
          const tick = Math.floor(currentTime.getTime() / 200);
          return Array.from({ length: total }, (_, i) => {
            const colorIdx = (i + tick) % terminalPalette.rainbow.length;
            const brightness = 0.6 + 0.4 * Math.abs(Math.sin((i + tick * 0.5) * 0.3));
            return (
              <Box
                key={i}
                flex={1}
                h="full"
                bg={terminalPalette.rainbow[colorIdx]}
                opacity={brightness}
                transition="background 0.2s, opacity 0.2s"
              />
            );
          });
        })()}
      </Flex>

      {/* ═══ Title bar: syntax-highlighted title + interaction tier ═══ */}
      <Flex
        bg={termHeader}
        px={[1.5, 2]}
        py={[1, 1.5]}
        color={termText}
        borderBottom={`1px solid ${termBorder}`}
        justify="space-between"
        fontSize={["3xs", "2xs", "xs"]}
        fontWeight="medium"
        flexWrap={["wrap", "nowrap"]}
        gap={[1, 0]}
        flexShrink={0}
      >
        {/* Left: traffic lights + syntax-highlighted title */}
        <Flex align="center" gap={1} flex={["1 1 100%", "1 1 auto"]}>
          <HStack spacing={1.5} mr={2}>
            <Box w="10px" h="10px" borderRadius="full" bg="#bf616a" />
            <Box w="10px" h="10px" borderRadius="full" bg="#ebcb8b" />
            <Box w="10px" h="10px" borderRadius="full" bg="#a3be8c" />
          </HStack>
          <DynamicIcon name="FaTerminal" boxSize={[2.5, 3]} color={termCommand} />
          <Text isTruncated>
            <Box as="span" color={termParam}>const </Box>
            <Box as="span" color={termPrompt} fontWeight="bold">{siteOwner.terminalUsername}</Box>
            <Box as="span" color={termSecondary}> = </Box>
            <Box as="span" color={termParam} display={["none", "inline"]}>new </Box>
            <Box as="span" color={termCommand} fontWeight="bold" display={["none", "inline"]}>Terminal</Box>
            <Box as="span" color={termSecondary} display={["none", "inline"]}>(</Box>
            <Box as="span" color={termHighlight} display={["none", "inline"]}>'research'</Box>
            <Box as="span" color={termSecondary} display={["none", "inline"]}>)</Box>
          </Text>
        </Flex>

        {/* Middle: research process status */}
        <Flex align="center">
          <Box
            px={1.5}
            bg={isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)'}
            borderRadius="sm"
            flexShrink={0}
          >
            <Text color={researchColor}>
              {currentResearch.label} {currentResearch.suffix}
            </Text>
          </Box>
        </Flex>

        {/* Right: time + interaction tier */}
        <Flex align="center" gap={[1, 2]}>
          <Text color={termHighlight} display={["none", "inline"]}>{formattedTime}</Text>
          <Flex
            align="center"
            gap={1}
            color={interactionTier.color}
            {...(interactionTier.isRainbow ? { sx: { animation: `${rainbow} 3s linear infinite` } } : {})}
          >
            <Box as="span" animation={`${pulse} 2s infinite ease-in-out`} display="inline-block">◉</Box>
            <Text>{interactionTier.label}</Text>
          </Flex>
        </Flex>
      </Flex>

      {/* ═══ Status bar: tmux-style segments ═══ */}
      <Flex
        bg={tc.touchBar}
        px={[1.5, 2]}
        py={[0.5, 1]}
        borderBottom={`1px solid ${termBorder}`}
        fontSize={["3xs", "2xs"]}
        align="center"
        justify="space-between"
        flexShrink={0}
        overflow="hidden"
      >
        {/* Left segments */}
        <Flex align="center" gap={0} overflow="hidden">
          <Flex align="center" gap={1} px={[1, 1.5]} flexShrink={0}>
            <DynamicIcon name="FaUser" boxSize={[2, 2.5]} color={termPrompt} />
            <Text color={termText} fontWeight="bold">{siteOwner.terminalUsername}</Text>
          </Flex>
          <Text color={tc.border}>│</Text>
          <Flex align="center" gap={1} px={[1, 1.5]} flexShrink={0}>
            <DynamicIcon name="FaClock" boxSize={[2, 2.5]} color={termHighlight} />
            <Text color={termSecondary}>{bostonDateStr}</Text>
          </Flex>
          <Text color={tc.border} display={["none", "inline"]}>│</Text>
          <Flex align="center" gap={1} px={1.5} flexShrink={0} display={["none", "flex"]}>
            <DynamicIcon name="FaFolder" boxSize={[2, 2.5]} color={termCommand} />
            <Text color={termCommand}>~/cortex/papers</Text>
          </Flex>
        </Flex>

        {/* Arrow */}
        <Flex align="center" px={[1, 2]} flexShrink={0} display={["none", "flex"]}>
          <DynamicIcon name="FaArrowRight" boxSize={[2, 2.5]} color={termSecondary} />
        </Flex>

        {/* Right segments */}
        <Flex align="center" gap={0} overflow="hidden">
          <Flex align="center" gap={1} px={1.5} flexShrink={0} display={["none", "none", "flex"]}>
            <DynamicIcon name="FaCodeBranch" boxSize={[2, 2.5]} color={termInfo} />
            <Text color={termInfo}>{termProcesses[processIndex]}</Text>
          </Flex>
          <Text color={tc.border} display={["none", "none", "inline"]}>│</Text>
          <Flex align="center" gap={1} px={[1, 1.5]} flexShrink={0}>
            <DynamicIcon name="FaBrain" boxSize={[2, 2.5]} color={termParam} />
            <Text color={memoryUsage > 90 ? termError : memoryUsage > 80 ? termWarning : termSuccess}>
              {memoryUsage}%
            </Text>
            <Box w="30px" h="3px" bg={tc.header} borderRadius="full" overflow="hidden" display={["none", "block"]}>
              <Box
                h="full"
                w={`${memoryUsage}%`}
                bg={memoryUsage > 90 ? termError : memoryUsage > 80 ? termWarning : termSuccess}
                borderRadius="full"
                transition="width 0.3s"
              />
            </Box>
          </Flex>
          <Text color={tc.border}>│</Text>
          <Flex align="center" gap={1} px={[1, 1.5]} flexShrink={0}>
            <DynamicIcon name="FaBolt" boxSize={[2, 2.5]} color={termHighlight} />
          </Flex>
          <Text color={tc.border} display={["none", "inline"]}>│</Text>
          <Flex align="center" gap={1} px={1.5} flexShrink={0} display={["none", "flex"]}>
            <DynamicIcon name="FaCoffee" boxSize={[2, 2.5]} color={termWarning} />
            <Text color={termWarning}>∞</Text>
            <Text color={termSecondary} fontSize="3xs" letterSpacing="-1px">{sparkDisplay}</Text>
          </Flex>
        </Flex>
      </Flex>

      {/* ═══ Scrollable content area ═══ */}
      <Box
        flex={1}
        bg={termBg}
        color={termText}
        overflowY="auto"
        maxH={["350px", "450px", "550px"]}
        sx={{
          '&::-webkit-scrollbar': { width: '6px', background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: tc.border, borderRadius: '3px' },
        }}
      >
        {/* Hint line - zsh-style syntax highlighting */}
        <Box
          px={[2, 3]}
          py={[0.5, 1]}
          fontSize={["3xs", "2xs"]}
          color={termInfo}
          borderBottom={`1px dotted ${termBorder}`}
          display={{ base: "none", sm: "block" }}
        >
          <Flex align="center" gap={[1, 2]}>
            <DynamicIcon name="FaChevronRight" boxSize={[1.5, 2]} color={termPrompt} />
            <Text color={termSuccess} fontWeight="bold">grep</Text>
            <Text color={termCommand}>-riI</Text>
            <Text color={termHighlight}>"knowledge"</Text>
            <Text color={termParam}>--context</Text>
            <Text color={termSecondary}>=</Text>
            <Text color={termWarning}>3</Text>
            <Text color={termSecondary} display={["none", "inline"]}>|</Text>
            <Text color={termSuccess} fontWeight="bold" display={["none", "inline"]}>sort</Text>
            <Text color={termCommand} display={["none", "inline"]}>-r</Text>
            <Text color={tc.command} fontStyle="italic" display={["none", "none", "inline"]} opacity={0.7}>
              {t('newsTimeline.clickToExpand')}
            </Text>
          </Flex>
        </Box>

        {/* Table header — syntax highlighted */}
        <Box p={[0.5, 1, 2]}>
          <Flex
            borderBottom={`1px solid ${termBorder}`}
            py={[0.5, 1]}
            fontSize={["3xs", "2xs", "xs"]}
            fontWeight="bold"
          >
            <Text w={COL_DATE} color={termHighlight} isTruncated>
              <Box as="span" display={{ base: "inline", sm: "none" }}>{t('newsTimeline.time')}</Box>
              <Box as="span" display={{ base: "none", sm: "inline" }}>{t('newsTimeline.timestamp')}</Box>
            </Text>
            <Text w={COL_TYPE} color={termParam} isTruncated>
              <Box as="span" display={{ base: "inline", sm: "none" }}>{t('newsTimeline.cat')}</Box>
              <Box as="span" display={{ base: "none", sm: "inline" }}>{t('newsTimeline.category')}</Box>
            </Text>
            <Text w={COL_ID} color={termInfo} display={{ base: "none", lg: "block" }}>{t('newsTimeline.pid')}</Text>
            <Text flex="1">
              <Box as="span" color={termSuccess}>MEMORY</Box>
              <Box as="span" color={termSecondary}>.</Box>
              <Box as="span" color={termCommand}>DUMP</Box>
            </Text>
            <Text w={COL_CTRL} color={termPrompt} textAlign="center">
              <Box as="span" display={{ base: "inline", sm: "none" }}>+</Box>
              <Box as="span" display={{ base: "none", sm: "inline" }}>{t('newsTimeline.ctrl')}</Box>
            </Text>
          </Flex>

          {/* Table rows */}
          {news.map((item, index) => (
            <Box
              key={index}
              borderBottom={`1px dotted ${termBorder}`}
              role="group"
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Flex
                py={[0.5, 1, 1.5]}
                px={[0, 0.5]}
                fontSize={["3xs", "2xs", "xs"]}
                align="center"
                cursor="pointer"
                onClick={() => toggleExpanded(index)}
                _hover={{ bg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
                bg={expandedItems[index] ? (isDark ? 'rgba(76,86,106,0.2)' : 'rgba(203,213,225,0.3)') : 'transparent'}
              >
                <Text w={COL_DATE} color={termHighlight} fontWeight="medium" isTruncated>
                  {formatDate(item.date)}
                </Text>
                <Box w={COL_TYPE}>
                  <Flex
                    as="span"
                    align="center"
                    gap={1}
                    px={[0.5, 1, 1.5]}
                    bg={typeColors[item.type.toLowerCase()]?.bg || typeColors.default.bg}
                    color={typeColors[item.type.toLowerCase()]?.fg || typeColors.default.fg}
                    borderRadius="sm"
                    fontSize={["4xs", "3xs", "2xs"]}
                    fontWeight="bold"
                    textTransform="uppercase"
                    display="inline-flex"
                    w="fit-content"
                  >
                    <Box display={{ base: "none", md: "inline-flex" }}>
                      <DynamicIcon
                        name={typeColors[item.type.toLowerCase()]?.icon || typeColors.default.icon}
                        boxSize={[2, 2.5]}
                      />
                    </Box>
                    <Box as="span" display={{ base: "inline", md: "none" }}>{item.type.substring(0, 3)}</Box>
                    <Box as="span" display={{ base: "none", md: "inline" }}>{item.type}</Box>
                  </Flex>
                </Box>
                <Text w={COL_ID} color={termInfo} fontFamily="mono" display={{ base: "none", lg: "block" }}>
                  <Box as="span" color={termSecondary}>0x</Box>
                  {(news.length - 1 - index).toString(16).padStart(4, '0')}
                </Text>
                <Box flex="1">
                  <Flex align="center" gap={1}>
                    {item.badge && (
                      <Text
                        fontSize={["4xs", "3xs"]}
                        px={[0.5, 1]}
                        borderRadius="sm"
                        bg={typeColors[item.type.toLowerCase()]?.bg || typeColors.default.bg}
                        color={typeColors[item.type.toLowerCase()]?.fg || typeColors.default.fg}
                        fontWeight="bold"
                        whiteSpace="nowrap"
                      >
                        {item.badge.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{200D}\u{20E3}]/gu, '').replace(' Accepted', '').replace('!', '').trim()}
                      </Text>
                    )}
                    <Text fontWeight="medium" color={termText} isTruncated fontSize={["2xs", "xs"]}>
                      {item.title}
                    </Text>
                  </Flex>
                  <Box display={{ base: "none", lg: "block" }}>
                    <Text color={termSecondary} fontSize={["3xs", "2xs"]} isTruncated mt={0.5}>
                      {getDescriptionText(item.description)}
                    </Text>
                  </Box>
                </Box>
                <Flex w={COL_CTRL} align="center" justify="center">
                  <Box
                    color={expandedItems[index] ? termInfo : termCommand}
                    fontWeight="bold"
                    borderRadius="sm"
                    px={[0.5, 1]}
                    py={0.5}
                    _hover={{ bg: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                    minW={["20px", "26px"]}
                    textAlign="center"
                  >
                    {expandedItems[index] ? '[-]' : '[+]'}
                  </Box>
                </Flex>
              </Flex>

              {/* Expanded details */}
              <Collapse in={expandedItems[index]} animateOpacity>
                <Box
                  pl={[2, 3, 10]}
                  pr={[2, 3]}
                  py={[1.5, 2]}
                  bg={isDark ? 'rgba(76,86,106,0.1)' : 'rgba(203,213,225,0.15)'}
                  borderLeft={`2px solid ${typeColors[item.type.toLowerCase()]?.fg || typeColors.default.fg}`}
                >
                  <Flex align="start" gap={2} mb={2}>
                    <Box
                      p={1.5}
                      borderRadius="md"
                      bg={typeColors[item.type.toLowerCase()]?.bg || typeColors.default.bg}
                      display={["none", "flex"]}
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                      mt={0.5}
                    >
                      <DynamicIcon
                        name={typeColors[item.type.toLowerCase()]?.icon || typeColors.default.icon}
                        boxSize={[3, 4]}
                        color={typeColors[item.type.toLowerCase()]?.fg || typeColors.default.fg}
                      />
                    </Box>
                    <Box flex={1} minW={0}>
                      <Text fontSize={["2xs", "xs"]} fontWeight="bold" color={termText} mb={0.5}>
                        {item.title}
                      </Text>
                      <Flex fontSize={["3xs", "2xs"]} gap={[1, 2]} flexWrap="wrap" align="center">
                        <Text color={typeColors[item.type.toLowerCase()]?.fg || typeColors.default.fg} fontWeight="bold" textTransform="uppercase">
                          {item.type}
                        </Text>
                        <Text color={termSecondary}>·</Text>
                        <Text color={termHighlight}>{item.date}</Text>
                        {item.badge && (
                          <>
                            <Text color={termSecondary}>·</Text>
                            <Text color={termSuccess} fontWeight="medium">
                              {item.badge.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{200D}\u{20E3}]/gu, '').trim()}
                            </Text>
                          </>
                        )}
                      </Flex>
                    </Box>
                  </Flex>
                  {item.description && (
                    <Text
                      fontSize={["2xs", "xs"]}
                      color={tc.secondary}
                      mb={2}
                      whiteSpace="pre-line"
                      lineHeight="1.6"
                      maxH={{ base: "100px", sm: "200px", md: "none" }}
                      overflowY={{ base: "auto", md: "visible" }}
                      sx={{
                        '&::-webkit-scrollbar': { width: '4px', background: 'transparent' },
                        '&::-webkit-scrollbar-thumb': { background: tc.border, borderRadius: '2px' },
                      }}
                    >
                      {linkifyDescription(item.description, { num: termHighlight, kw: termCommand, str: termSuccess })}
                    </Text>
                  )}
                  {item.links.length > 0 && (
                    <Flex wrap="wrap" gap={[1.5, 2]} mt={1}>
                      {item.links.map((link, i) => (
                        <Link key={i} href={link.url} isExternal onClick={(e) => e.stopPropagation()} _hover={{ textDecoration: 'none' }}>
                          <Flex
                            align="center"
                            gap={1}
                            px={[1.5, 2]}
                            py={[0.5, 1]}
                            bg={isDark ? 'rgba(136,192,208,0.08)' : 'rgba(42,118,156,0.06)'}
                            borderRadius="md"
                            border="1px solid"
                            borderColor={isDark ? 'rgba(136,192,208,0.2)' : 'rgba(42,118,156,0.15)'}
                            color={termCommand}
                            fontSize={["3xs", "2xs"]}
                            transition="all 0.15s"
                            _hover={{ bg: isDark ? 'rgba(136,192,208,0.15)' : 'rgba(42,118,156,0.1)', borderColor: termCommand }}
                          >
                            <DynamicIcon name={link.icon || 'FaExternalLinkAlt'} boxSize={[2, 2.5]} />
                            <Text isTruncated maxW={{ base: "60px", sm: "120px", md: "200px" }}>{link.text}</Text>
                          </Flex>
                        </Link>
                      ))}
                    </Flex>
                  )}
                </Box>
              </Collapse>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ═══ Footer prompt: FIXED at bottom, never scrolls ═══ */}
      <Flex
        px={[2, 3]}
        py={[1, 1.5]}
        borderTop={`1px solid ${termBorder}`}
        bg={termHeader}
        fontSize={["3xs", "2xs", "xs"]}
        align="center"
        position="relative"
        flexShrink={0}
      >
        <Flex align="center" gap={1} mr={1.5} flexShrink={0}>
          <DynamicIcon name="FaChevronRight" boxSize={[1.5, 2]} color={termPrompt} />
          <Box display={{ base: "none", sm: "inline" }}>
            <DynamicIcon name="FaChevronRight" boxSize={[1.5, 2]} color={termCommand} />
          </Box>
        </Flex>
        <Text color={termSecondary} isTruncated>
          {hoveredItem !== null
            ? (<>
                <Box as="span" color={termSuccess} fontWeight="bold">cat</Box>{' '}
                <Box as="span" color={termParam}>./brain/memories/</Box>
                <Box as="span" color={termHighlight}>
                  {truncateText(news[hoveredItem]?.title, 25).replace(/\s+/g, '_').toLowerCase()}
                </Box>
              </>)
            : (<>
                <Box as="span" color={termSuccess} fontWeight="bold">find</Box>{' '}
                <Box as="span" color={termHighlight}>./brain</Box>{' '}
                <Box as="span" color={termCommand}>-type</Box>{' '}
                <Box as="span" color={termWarning}>f</Box>{' '}
                <Box as="span" color={termCommand}>-name</Box>{' '}
                <Box as="span" color={termHighlight}>"*.memory"</Box>{' '}
                <Box as="span" color={termSecondary} display={["none", "inline"]}>|</Box>{' '}
                <Box as="span" color={termSuccess} fontWeight="bold" display={["none", "inline"]}>sort</Box>{' '}
                <Box as="span" color={termCommand} display={["none", "inline"]}>-r</Box>{' '}
                <Box as="span" color={termSecondary} display={["none", "inline"]}>|</Box>{' '}
                <Box as="span" color={termSuccess} fontWeight="bold" display={["none", "inline"]}>head</Box>{' '}
                <Box as="span" color={termWarning} display={["none", "inline"]}>-10</Box>
              </>)
          }
        </Text>
        <Box
          h={["10px", "14px"]}
          w={["5px", "7px"]}
          bg={termPrompt}
          ml={1.5}
          borderRadius="1px"
          sx={{ animation: `${blink} 1s step-end infinite` }}
        />
        {/* Easter egg: changes with interaction count */}
        <Text
          position="absolute"
          right={[2, 3]}
          color={termInfo}
          opacity={0.5}
          fontSize={["4xs", "3xs"]}
          fontStyle="italic"
          display={{ base: "none", sm: "block" }}
        >
          {interactions >= 6
            ? t('newsTimeline.easterEgg3')
            : interactions >= 3
              ? t('newsTimeline.easterEgg2')
              : t('newsTimeline.easterEgg1')}
        </Text>
      </Flex>
    </Box>
  )
}

export default NewsTimeline
