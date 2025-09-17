import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

import { ChatBubbleIcon } from './icons';
import { InfoBanner } from './info-banner';
import { useAuthContext } from './session-provider';

export const Overview = () => {
  const { isAuthDisabled, isPersistenceDisabled } = useAuthContext();

  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex flex-col gap-6 max-w-xl px-4">
        <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to Thunderbird Labs
          </h1>
          <p className="text-lg font-medium">
            Chat directly with 2,800+ APIs powered by{" "}
            <Link
              className="font-medium underline underline-offset-4"
              href="https://pipedream.com/docs/connect/mcp/developers"
              target="_blank"
            >
              Pipedream Connect
            </Link>
          </p>
        </div>
        <InfoBanner isAuthDisabled={isAuthDisabled} isPersistenceDisabled={isPersistenceDisabled} />
      </div>
    </motion.div>
  );
};
