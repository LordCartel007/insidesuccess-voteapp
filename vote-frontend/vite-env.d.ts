/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
