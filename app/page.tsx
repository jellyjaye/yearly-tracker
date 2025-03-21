'use client';

import { Box, Container, Heading, SimpleGrid, Text, VStack, HStack, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import DayBox from './components/DayBox';

/**
 * @description 主页组件，展示年度追踪器
 * @returns {JSX.Element} 渲染的主页组件
 */
export default function Home() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const days = Array.from({ length: 365 }, (_, index) => {
    const date = new Date(year, 0, index + 1);
    return date;
  });

  const handlePrevYear = () => {
    setYear(prev => prev - 1);
  };

  const handleNextYear = () => {
    setYear(prev => prev + 1);
  };

  /**
   * @description 格式化悬浮显示的日期
   */
  const formatHoverDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <Container maxW="container.xl" py={4}>
      <VStack spacing={1} mb={4}>
        <HStack spacing={4} align="center">
          <IconButton
            aria-label="上一年"
            icon={<ChevronLeftIcon boxSize={6} />}
            onClick={handlePrevYear}
            size="sm"
            variant="ghost"
          />
          <Heading size="md" textAlign="center">年度追踪器 {year}</Heading>
          <IconButton
            aria-label="下一年"
            icon={<ChevronRightIcon boxSize={6} />}
            onClick={handleNextYear}
            size="sm"
            variant="ghost"
          />
        </HStack>
        <Text fontSize="sm" color="gray.600" height="1.2em">
          {hoverDate ? formatHoverDate(hoverDate) : ' '}
        </Text>
      </VStack>
      <SimpleGrid columns={{ base: 7, md: 15, lg: 20 }} spacing={1.5}>
        {days.map((date, index) => (
          <DayBox 
            key={index} 
            date={date} 
            onHover={setHoverDate}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
} 