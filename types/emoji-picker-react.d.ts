declare module 'emoji-picker-react' {
  export interface EmojiClickData {
    emoji: string;
    getImageUrl: () => string;
    names: string[];
    unified: string;
    unifiedWithoutSkinTone: string;
  }

  export enum Theme {
    AUTO = 'auto',
    LIGHT = 'light',
    DARK = 'dark'
  }

  export interface PreviewConfig {
    defaultEmoji?: string;
    defaultCaption?: string;
  }

  export interface EmojiPickerProps {
    onEmojiClick: (emojiData: EmojiClickData) => void;
    autoFocusSearch?: boolean;
    theme?: Theme;
    searchPlaceHolder?: string;
    width?: string | number;
    height?: string | number;
    lazyLoadEmojis?: boolean;
    previewConfig?: PreviewConfig;
  }

  const EmojiPicker: React.FC<EmojiPickerProps>;
  export default EmojiPicker;
} 