import Today from '@/components/pages/Today';
import Projects from '@/components/pages/Projects';
import Archive from '@/components/pages/Archive';
import Insights from '@/components/pages/Insights';

export const routes = {
  today: {
    id: 'today',
    label: 'Today',
    path: '/',
    icon: 'Calendar',
    component: Today
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    path: '/projects',
    icon: 'FolderOpen',
    component: Projects
  },
  archive: {
    id: 'archive',
    label: 'Archive',
    path: '/archive',
    icon: 'Archive',
    component: Archive
  },
  insights: {
    id: 'insights',
    label: 'Insights',
    path: '/insights',
    icon: 'TrendingUp',
    component: Insights
  }
};

export const routeArray = Object.values(routes);

export default routes;