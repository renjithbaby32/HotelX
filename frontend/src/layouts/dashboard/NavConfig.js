import Iconify from '../../components/Iconify';

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/admin',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'hotels',
    path: '/admin/hotels',
    icon: getIcon('eva:home-fill'),
  },
  {
    title: 'users',
    path: '/admin/users',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'hotel owners',
    path: '/admin/hotel-owners',
    icon: getIcon('eva:file-text-fill'),
  },
  {
    title: 'sales report',
    path: '/admin/sales-report',
    icon: getIcon('eva:lock-fill'),
  },
];

export default navConfig;
