/// <reference types="vite/client" />

// SVG imports declaration
declare module '*.svg' {
  const content: string
  export default content
}

// PNG imports declaration  
declare module '*.png' {
  const content: string
  export default content
}

// JPG imports declaration
declare module '*.jpg' {
  const content: string
  export default content
}

// JPEG imports declaration
declare module '*.jpeg' {
  const content: string
  export default content
}

// WebP imports declaration
declare module '*.webp' {
  const content: string
  export default content
}

// CSS modules declaration with proper TypeScript support
declare module '*.module.css' {
  const classes: Readonly<Record<string, string>>
  export default classes
}

declare module '*.module.scss' {
  const classes: Readonly<Record<string, string>>
  export default classes
}

declare module '*.module.sass' {
  const classes: Readonly<Record<string, string>>
  export default classes
}

// Environment variables with proper typing
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_PORT: string
  // Add other env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 