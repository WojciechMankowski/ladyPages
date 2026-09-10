/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Measurement ID Google Analytics 4, np. `G-XXXXXXXXXX`. Puste = analityka wyłączona. */
  readonly VITE_GA_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
