export const LogoSidebar = () => {
  return (
    <div
      className={`
        p-4 flex justify-center
        group-data-[collapsible=icon]:p-2
      `}
    >
      <div
        className={`
          bg-no-repeat bg-contain bg-center bg-logo
          w-[84px] h-[28px]
          transition-all duration-200
          group-data-[collapsible=icon]:w-8
          group-data-[collapsible=icon]:h-8
        `}
      />
    </div>
  );
};
