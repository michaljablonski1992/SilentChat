import SidebarWrapper from '@/components/shared/sidebar/SidebarWrapper';

interface Props{
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return <SidebarWrapper>{ children }</SidebarWrapper>;
}

export default Layout;