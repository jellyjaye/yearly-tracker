'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  Button,
  VStack,
  IconButton,
  Text,
  Tooltip,
  useToast,
  HStack,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';

interface DayBoxProps {
  date: Date;
  onHover: (date: Date | null) => void;
}

interface DayData {
  emoji: string;
  note: string;
}

/**
 * @description 单日追踪组件，包含emoji选择和笔记功能
 * @param {DayBoxProps} props - 组件属性
 * @returns {JSX.Element} 渲染的日期框组件
 */
export default function DayBox({ date, onHover }: DayBoxProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [note, setNote] = useState('');
  const [showClear, setShowClear] = useState(false);
  const toast = useToast();

  /**
   * @description 生成用于存储的唯一键，包含年份信息
   */
  const getStorageKey = () => {
    return `day-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  /**
   * @description 从本地存储加载数据
   */
  useEffect(() => {
    setSelectedEmoji('');
    setNote('');
    const storedData = localStorage.getItem(getStorageKey());
    if (storedData) {
      const data: DayData = JSON.parse(storedData);
      setSelectedEmoji(data.emoji);
      setNote(data.note);
    }
  }, [date]);

  /**
   * @description 保存数据到本地存储
   */
  const saveToStorage = (emoji: string, noteText: string) => {
    const data: DayData = {
      emoji,
      note: noteText
    };
    localStorage.setItem(getStorageKey(), JSON.stringify(data));
  };

  /**
   * @description 处理emoji选择
   */
  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    setSelectedEmoji(emoji);
    saveToStorage(emoji, note);
  };

  /**
   * @description 清除当前日期的数据
   */
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEmoji('');
    setNote('');
    localStorage.removeItem(getStorageKey());
    toast({
      title: "已清除",
      description: "已删除该日期的记录",
      status: "info",
      duration: 1500,
      isClosable: true,
      position: "top"
    });
  };

  /**
   * @description 保存笔记
   */
  const handleSave = () => {
    saveToStorage(selectedEmoji, note);
    toast({
      title: "已保存",
      description: "笔记已保存",
      status: "success",
      duration: 1500,
      isClosable: true,
      position: "top"
    });
    onClose();
  };

  /**
   * @description 判断日期是否已过
   */
  const isPastDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  return (
    <>
      <Box
        position="relative"
        p={1.5}
        border="1px"
        borderColor="gray.200"
        borderRadius="md"
        cursor="pointer"
        onClick={onOpen}
        bg={selectedEmoji ? 'gray.50' : 'white'}
        _hover={{ bg: 'gray.100' }}
        onMouseEnter={() => {
          onHover(date);
          setShowClear(true);
        }}
        onMouseLeave={() => {
          onHover(null);
          setShowClear(false);
        }}
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="38px"
        minW="38px"
        h="38px"
        w="38px"
      >
        {selectedEmoji ? (
          <Text fontSize="xl">{selectedEmoji}</Text>
        ) : isPastDate() ? (
          <Text fontSize="2xs" lineHeight="1" color="black">▫️</Text>
        ) : null}
        {showClear && selectedEmoji && (
          <IconButton
            aria-label="清除"
            icon={<CloseIcon boxSize={2.5} />}
            size="xs"
            position="absolute"
            top={0.5}
            right={0.5}
            onClick={handleClear}
            colorScheme="red"
            variant="ghost"
            opacity={0.6}
            _hover={{ opacity: 1 }}
            minW="14px"
            height="14px"
            padding={0}
          />
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={2}>
            {date.toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6} align="stretch">
              <Box width="100%">
                <HStack mb={2} justify="space-between" align="center">
                  <Text fontWeight="bold">选择心情：</Text>
                  {selectedEmoji && (
                    <Box
                      p={1.5}
                      borderRadius="md"
                      bg="blue.50"
                      border="1px solid"
                      borderColor="blue.200"
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      <Text fontSize="sm" color="gray.600">已选择：</Text>
                      <Text fontSize="xl">{selectedEmoji}</Text>
                    </Box>
                  )}
                </HStack>
                <Box 
                  width="100%" 
                  height="350px" 
                  overflow="hidden" 
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <EmojiPicker
                    onEmojiClick={handleEmojiSelect}
                    autoFocusSearch={false}
                    theme={Theme.AUTO}
                    searchPlaceHolder="搜索表情..."
                    width="100%"
                    height="100%"
                    lazyLoadEmojis={true}
                    previewConfig={{ defaultCaption: '' }}
                  />
                </Box>
              </Box>
              <Box width="100%">
                <Text mb={2} fontWeight="bold">添加笔记：</Text>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="记录今天的心情和完成的事项..."
                  size="md"
                  rows={10}
                />
              </Box>
              <Button colorScheme="blue" onClick={handleSave} width="100%">
                保存
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
} 