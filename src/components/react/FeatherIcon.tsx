import React from "react";
import Icon, { type FeatherIconProps } from "feather-icons-react";

/**
 * This component is a wrapper around feather-icons-reacther icons prepared to be used in the markdown files content of the project.
 * @see astro.config.js for the configuration of the auto-import plugin.
 * @see https://www.npmjs.com/package/astro-auto-import?activeTab=readme for more information.
 * @param props
 * @returns
 */
export default function FeatherIcon(props: FeatherIconProps) {
  const iconName = props.icon?.startsWith("_")
    ? props.icon.substring(1, props.icon.length)
    : props.icon;

  return <Icon {...props} icon={iconName as FeatherIconProps["icon"]} />;
}
