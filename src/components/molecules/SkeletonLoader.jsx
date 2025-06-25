import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, type = 'task' }) => {
  const skeletonItems = Array.from({ length: count }, (_, i) => i);

  const TaskSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-soft p-6 border border-pink-50">
      <div className="flex items-start space-x-4">
        <div className="w-5 h-5 bg-gray-200 rounded-lg animate-pulse" />
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
          <div className="flex space-x-2">
            <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );

  const ProjectSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-soft p-6 border border-pink-50">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-8 animate-pulse" />
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full animate-pulse" />
      </div>
    </div>
  );

  const SkeletonComponent = type === 'project' ? ProjectSkeleton : TaskSkeleton;

  return (
    <div className="space-y-4">
      {skeletonItems.map((index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <SkeletonComponent />
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;