'use client';

import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ChevronRightIcon,
  Copy,
  HeadphonesIcon,
  MessageSquare,
  Phone,
  Send,
} from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactInfoDto } from '@/core/dtos/common/ContactInfoDto';
import { useGetContactInfo } from '@/lib/hooks/service/common/useGetContactInfo';

const CustomerServicePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | undefined>();
  const t = useTranslations();

  const {
    data: customerServiceContactInfoData,
    isLoading,
    isError,
    error,
  } = useGetContactInfo();

  const contactInfoItems = customerServiceContactInfoData?.contactinfo || [];

  const wechatInfo = contactInfoItems.find(item => item.type === 'wechat');
  const telegramInfo = contactInfoItems.find(item => item.type === 'telegram');
  const phoneNumbers = contactInfoItems.filter(item => item.type === 'phone');

  const handleCopy = (text: string | undefined, type: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopySuccess(type);
    setTimeout(() => setCopySuccess(undefined), 2000);
  };

  const getContactLabel = (
    item: { name: string; type: string } | undefined,
    fallbackKey: string
  ) => {
    return item?.name || t(fallbackKey);
  };

  const renderCopyButton = (
    text: string | undefined,
    identifier: string,
    colorClass: string,
    hoverColorClass: string,
    bgHoverClass: string
  ) => (
    <button
      onClick={() => handleCopy(text, identifier)}
      className={`${colorClass} ${hoverColorClass} transition-colors p-1.5 rounded-full ${bgHoverClass}`}
      aria-label={`${t('common.copy')} ${identifier}`}
      disabled={!text}
    >
      <Copy size={16} />
      {copySuccess === identifier && (
        <span className="absolute -translate-y-8 -translate-x-6 bg-black text-white text-xs px-2 py-1 rounded opacity-80 whitespace-nowrap">
          {t('common.copied')}
        </span>
      )}
    </button>
  );

  const renderContactItem = (
    label: string,
    value: string | undefined,
    identifier: string,
    colorClass: string,
    hoverColorClass: string,
    bgHoverClass: string,
    icon: React.ReactNode
  ) => (
    <div
      key={Date.now() + identifier}
      className="flex w-full justify-between items-center px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-medium text-gray-700">{label}:</span>
      </div>
      <div className="flex items-center">
        {value ? (
          <span className="mr-2 text-gray-800 font-medium break-all">
            {value}
          </span>
        ) : (
          <span className="mr-2 text-gray-400 italic text-sm">
            {t('common.notAvailable')}
          </span>
        )}
        {renderCopyButton(
          value,
          identifier,
          colorClass,
          hoverColorClass,
          bgHoverClass
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="cursor-pointer"
        >
          <Button
            variant="outline"
            className="bg-gradient-to-r from-[#FE8C00] to-[#F83600] text-white border-none shadow-md hover:shadow-lg transition-all duration-300 group px-4 py-2 h-auto"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <HeadphonesIcon className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">
                {t('common.customerService')}
              </span>
              <ChevronRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="p-0 overflow-hidden rounded-xl w-[90%] max-h-[85vh] sm:max-w-[410px] shadow-xl flex flex-col">
        <div className="bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] p-5 sticky top-0 z-10 flex-shrink-0">
          <DialogHeader className="px-2">
            <DialogTitle className="text-xl font-bold text-center text-white">
              {t('common.customerServiceContact')}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="flex-grow overflow-y-auto bg-gray-50">
          <Tabs defaultValue="wechat" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 sticky top-0 z-[5] bg-gray-100 rounded-none p-1 h-auto">
              <TabsTrigger
                value="wechat"
                className="py-2.5 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-1.5"
                >
                  <path d="M9.5,4C5.36,4 2,6.69 2,10C2,11.89 3.08,13.56 4.78,14.66L4,17L6.5,15.5C7.39,15.81 8.37,16 9.41,16C9.15,15.37 9,14.7 9,14C9,10.69 12.13,8 16,8C16.19,8 16.38,8 16.56,8.03C15.54,5.69 12.78,4 9.5,4M6.5,6.5A1,1 0 0,1 7.5,7.5A1,1 0 0,1 6.5,8.5A1,1 0 0,1 5.5,7.5A1,1 0 0,1 6.5,6.5M11.5,6.5A1,1 0 0,1 12.5,7.5A1,1 0 0,1 11.5,8.5A1,1 0 0,1 10.5,7.5A1,1 0 0,1 11.5,6.5M16,9C13.24,9 11,11.24 11,14C11,16.76 13.24,19 16,19C16.84,19 17.63,18.81 18.36,18.46L20,19.5L19.5,17.97C20.41,17.08 21,15.6 21,14C21,11.24 18.76,9 16,9M14,11.5A1,1 0 0,1 15,12.5A1,1 0 0,1 14,13.5A1,1 0 0,1 13,12.5A1,1 0 0,1 14,11.5M18,11.5A1,1 0 0,1 19,12.5A1,1 0 0,1 18,13.5A1,1 0 0,1 17,12.5A1,1 0 0,1 18,11.5Z" />
                </svg>
                {t('common.wechat')}
              </TabsTrigger>
              <TabsTrigger
                value="telegram"
                className="py-2.5 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Send className="w-4 h-4 mr-1.5" /> {t('common.telegram')}
              </TabsTrigger>
              <TabsTrigger
                value="phone"
                className="py-2.5 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Phone className="w-4 h-4 mr-1.5" /> {t('common.phone')}
              </TabsTrigger>
            </TabsList>

            {isLoading && (
              <div className="p-6 space-y-4">
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            )}

            {isError && (
              <div className="p-6">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>{t('common.error')}</AlertTitle>
                  <AlertDescription>
                    {t('common.errorFetchingContact')}
                    {error?.message && `: ${error.message}`}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {!isLoading && !isError && contactInfoItems.length > 0 && (
              <>
                <TabsContent value="wechat" className="mt-0 p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-[#4ACF50] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="#fff"
                        >
                          <path d="M9.5,4C5.36,4 2,6.69 2,10C2,11.89 3.08,13.56 4.78,14.66L4,17L6.5,15.5C7.39,15.81 8.37,16 9.41,16C9.15,15.37 9,14.7 9,14C9,10.69 12.13,8 16,8C16.19,8 16.38,8 16.56,8.03C15.54,5.69 12.78,4 9.5,4M6.5,6.5A1,1 0 0,1 7.5,7.5A1,1 0 0,1 6.5,8.5A1,1 0 0,1 5.5,7.5A1,1 0 0,1 6.5,6.5M11.5,6.5A1,1 0 0,1 12.5,7.5A1,1 0 0,1 11.5,8.5A1,1 0 0,1 10.5,7.5A1,1 0 0,1 11.5,6.5M16,9C13.24,9 11,11.24 11,14C11,16.76 13.24,19 16,19C16.84,19 17.63,18.81 18.36,18.46L20,19.5L19.5,17.97C20.41,17.08 21,15.6 21,14C21,11.24 18.76,9 16,9M14,11.5A1,1 0 0,1 15,12.5A1,1 0 0,1 14,13.5A1,1 0 0,1 13,12.5A1,1 0 0,1 14,11.5M18,11.5A1,1 0 0,1 19,12.5A1,1 0 0,1 18,13.5A1,1 0 0,1 17,12.5A1,1 0 0,1 18,11.5Z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {t('common.wechat')}
                      </h3>
                    </div>
                    <div className="flex flex-col items-center space-y-5">
                      {wechatInfo?.image && (
                        <div className="relative w-64 h-64 overflow-hidden bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                          <div className="w-full h-full bg-white flex items-center justify-center">
                            <Image
                              src={wechatInfo.image}
                              alt={`${t('common.wechat')} QR Code`}
                              width={240}
                              height={240}
                              className="object-contain"
                              priority
                              unoptimized={!!wechatInfo.image}
                            />
                          </div>
                        </div>
                      )}
                      {renderContactItem(
                        getContactLabel(wechatInfo, 'common.wechatId'),
                        wechatInfo?.contact_number,
                        `wechat-${wechatInfo?.id}`,
                        'text-[#4ACF50]',
                        'hover:text-[#3CB043]',
                        'hover:bg-green-50',
                        <MessageSquare size={16} className="text-gray-500" />
                      )}
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="telegram" className="mt-0 p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-[#0088cc] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <Send size={18} className="text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {t('common.telegram')}
                      </h3>
                    </div>

                    {telegramInfo?.contact_number ? (
                      <>
                        {renderContactItem(
                          getContactLabel(telegramInfo, 'common.telegramId'),
                          telegramInfo.contact_number,
                          `telegram-${telegramInfo.id}`,
                          'text-[#0088cc]',
                          'hover:text-[#0077b5]',
                          'hover:bg-blue-50',
                          <Send size={16} className="text-gray-500" />
                        )}

                        <Button
                          className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white py-5 rounded-lg shadow-sm"
                          onClick={() =>
                            window.open(
                              `https://t.me/${telegramInfo.contact_number.replace('@', '')}`,
                              '_blank'
                            )
                          }
                          disabled={!telegramInfo.contact_number}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <Send className="w-4 h-4" />
                            {t('common.messageUs')} {t('common.telegram')}
                          </div>
                        </Button>
                      </>
                    ) : (
                      <p className="text-center text-gray-500 italic py-4">
                        {t('common.noTelegramInfo')}
                      </p>
                    )}
                  </motion.div>
                </TabsContent>

                <TabsContent value="phone" className="mt-0 p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3"
                  >
                    <div className="flex items-center mb-1">
                      <div className="w-8 h-8 bg-[#FF8A00] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <Phone size={16} className="text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {t('common.contact')}
                      </h3>
                    </div>
                    {phoneNumbers.length > 0 ? (
                      phoneNumbers.map(phone =>
                        renderContactItem(
                          phone.name || t('common.phoneNumber'),
                          phone.contact_number,
                          `phone-${phone.id}`,
                          'text-[#FF8A00]',
                          'hover:text-[#FF6B00]',
                          'hover:bg-orange-50',
                          <Phone size={16} className="text-gray-500" />
                        )
                      )
                    ) : (
                      <p className="text-center text-gray-500 italic py-4">
                        {t('common.noPhoneNumbers')}
                      </p>
                    )}
                  </motion.div>
                </TabsContent>
              </>
            )}

            {!isLoading && !isError && contactInfoItems.length === 0 && (
              <div className="p-6 text-center text-gray-500 italic">
                {t('common.noContactInfo')}
              </div>
            )}
          </Tabs>
        </div>

        <div className="p-4 flex justify-end sticky bottom-0 bg-white border-t flex-shrink-0">
          <DialogClose asChild>
            <Button variant="outline" className="px-6">
              {t('common.close')}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerServicePopup;
