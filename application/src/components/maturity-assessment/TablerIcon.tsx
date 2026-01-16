import tablerIconData from '@iconify-json/tabler/icons.json';
import React from 'react';

type TablerIconData = {
  icons: Record<string, { body: string; width?: number; height?: number }>;
  width?: number;
  height?: number;
};

const tablerIcons = tablerIconData as TablerIconData;

type TablerIconProps = {
  name: string;
  className?: string;
  ariaHidden?: boolean;
};

const TablerIcon = ({ name, className, ariaHidden = true }: TablerIconProps) => {
  const iconName = name.replace('tabler:', '');
  const icon = tablerIcons.icons[iconName];
  if (!icon) return null;

  const width = icon.width ?? tablerIcons.width ?? 24;
  const height = icon.height ?? tablerIcons.height ?? 24;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden={ariaHidden}
      focusable="false"
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
};

export default TablerIcon;
