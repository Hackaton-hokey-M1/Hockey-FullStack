import { useTransition } from "react";

import { useLocale } from 'next-intl';

import { usePathname, useRouter } from 'next/navigation';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SUPPORTED_LANGUAGES = ['en', 'fr'] as const;

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const changeLanguage = (lang: string) => {
    startTransition(() => {
      const segments = pathname.split('/').filter(Boolean);
      if (SUPPORTED_LANGUAGES.includes(segments[0] as never)) {
        segments[0] = lang;
      } else {
        segments.unshift(lang);
      }
      const newPath = '/' + segments.join('/');
      router.push(newPath);
    });
  };

  return (
    <Select onValueChange={changeLanguage} defaultValue={locale}>
      <SelectTrigger className="w-[90px]" disabled={isPending}>
        <SelectValue placeholder="Select language"/>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="fr">French</SelectItem>
      </SelectContent>
    </Select>
  );
};
