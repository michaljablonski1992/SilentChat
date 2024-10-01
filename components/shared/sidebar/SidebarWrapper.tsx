import Nav from './nav/Nav';

interface Props {
  children: React.ReactNode;
}

const SidebarWrapper = ({ children }: Props) => {
  return (
    <div className="h-full w-full p-4 flex flex-col lg:flex-row">
      <Nav mode='mobile' />
      <Nav mode='desktop' />
      <main className="h-[calc(100%-80px)] lg:h-full w-full flex gap-4">
        {children}
      </main>
    </div>
  );
};

export default SidebarWrapper;
