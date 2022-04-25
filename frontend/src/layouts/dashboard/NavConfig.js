import Iconify from '../../components/Iconify';

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

export const navConfigForAdmin = [
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
  {
    title: 'log out',
    path: '/login',
    icon: getIcon('eva:power-fill'),
  },
];

export const navConfigForHotelOwner = [
  {
    title: 'overview',
    path: '/hotel-owner',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'my hotels',
    path: '/hotel-owner/hotels',
    icon: getIcon('eva:home-fill'),
  },
  {
    title: 'add a new hotel',
    path: '/hotel-owner/add',
    icon: getIcon('eva:plus-fill'),
  },
  {
    title: 'promote your hotel',
    path: '/hotel-owner/add-promotion',
    icon: getIcon('eva:shake-fill'),
  },
  {
    title: 'log out',
    path: '/login',
    icon: getIcon('eva:power-fill'),
  },
];
