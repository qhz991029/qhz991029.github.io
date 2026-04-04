import React from 'react'
import { Popover, PopoverTrigger, PopoverContent, PopoverBody, PopoverArrow, VStack, Text, Badge } from '@chakra-ui/react'

interface EasterEggProps {
  trigger: React.ReactNode
  title: string
  content: string | React.ReactNode
  type?: "info" | "tip" | "fun"
}

const EasterEgg: React.FC<EasterEggProps> = ({ 
  trigger, 
  title, 
  content, 
  type = "info" 
}) => {
  const getBadgeProps = () => {
    switch(type) {
      case "tip":
        return { colorScheme: "purple", children: "💡 Pro Tip" }
      case "fun":
        return { colorScheme: "pink", children: "🎮 Fun Fact" }
      default:
        return { colorScheme: "cyan", children: "ℹ️ Did you know?" }
    }
  }

  return (
    <Popover trigger="hover" placement="bottom" isLazy>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent 
        p={4} 
        maxW="400px" 
        bg="var(--card-bg)"
        borderColor="var(--border-color)"
        shadow="xl" 
        zIndex={9999}
        position="relative"
        _focus={{ outline: 'none' }}
      >
        <PopoverArrow bg="var(--card-bg)" />
        <PopoverBody>
          <VStack align="start" spacing={3}>
            <Badge {...getBadgeProps()} />
            <Text fontWeight="bold" fontSize="sm">{title}</Text>
            <Text fontSize="sm">{content}</Text>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default EasterEgg 