/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEODB_API_KEY: string
  readonly VITE_GEODB_API_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
