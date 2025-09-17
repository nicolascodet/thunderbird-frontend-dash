import { motion } from 'framer-motion';
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
        <div className="flex flex-col gap-4 text-center">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            How can I help you today?
          </h1>
        </div>
        <InfoBanner isAuthDisabled={isAuthDisabled} isPersistenceDisabled={isPersistenceDisabled} />
      </div>
    </motion.div>
  );
};
