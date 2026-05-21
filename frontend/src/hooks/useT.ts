"use client";

import { translations, type TKey, type Lang } from "@/i18n";
import { useLangStore } from "@/stores/langStore";

export function useT() {
  const lang = useLangStore(s => s.lang);

  function t(key: TKey): string {
    const val = translations[lang][key] ?? translations.en[key];
    if (typeof val === "function") return key; // callable keys need args, use t.fn()
    return val as string;
  }

  // For keys that are functions (dynamic strings)
  function tf<T extends TKey>(
    key: T,
    ...args: Parameters<Extract<typeof translations.en[T], (...a: never[]) => string>>
  ): string {
    const fn = (translations[lang][key] ?? translations.en[key]) as (...a: unknown[]) => string;
    if (typeof fn === "function") return fn(...args);
    return fn as unknown as string;
  }

  return { t, tf, lang };
}

export type { TKey, Lang };
