function createFileContent({
  description,
  typeName,
  exportName,
  payload,
  version,
  commit,
  timestamp,
}) {
  const serializedPayload = serializePayload(payload);

  return `/**
 * Auto-generated ${description} from branding repository
 * DO NOT EDIT - This file is generated during the build process
 * Source: @hoverkraft-tech/branding
 * Version: ${version}
 * Commit: ${commit}
 * Generated: ${timestamp}
 */

import type { ${typeName} } from './types';

export const ${exportName}: ${typeName} = ${serializedPayload};
`;
}

const INDENT = "  ";

function serializePayload(payload) {
  return formatValue(payload, 0);
}

function formatValue(value, level) {
  const primitive = formatPrimitiveValue(value);
  if (primitive !== null) {
    return primitive;
  }

  if (Array.isArray(value)) {
    return formatArray(value, level);
  }

  if (typeof value === "object") {
    return formatObject(value, level);
  }

  throw new TypeError(`Unsupported value type: ${typeof value}`);
}

function formatArray(values, level) {
  if (!values.length) {
    return "[]";
  }

  const inline = tryFormatInlineArray(values, level);
  if (inline) {
    return inline;
  }

  const nextLevel = level + 1;
  const indent = INDENT.repeat(level);
  const childIndent = INDENT.repeat(nextLevel);
  const items = values
    .map((item) => `${childIndent}${formatValue(item, nextLevel)},`)
    .join("\n");

  return `[\n${items}\n${indent}]`;
}

function tryFormatInlineArray(values, level) {
  const parts = [];

  for (const value of values) {
    const primitive = formatPrimitiveValue(value);
    if (primitive === null) {
      return null;
    }

    parts.push(primitive);
  }

  const inlineContent = `[${parts.join(", ")}]`;
  const inlineLength = INDENT.length * level + inlineContent.length;

  if (inlineLength <= 120) {
    return inlineContent;
  }

  return null;
}

function formatObject(object, level) {
  const entries = Object.entries(object);

  if (!entries.length) {
    return "{}";
  }

  const nextLevel = level + 1;
  const indent = INDENT.repeat(level);
  const childIndent = INDENT.repeat(nextLevel);

  const lines = entries.map(([key, val]) => {
    return `${childIndent}${formatPropertyKey(key)}: ${formatValue(val, nextLevel)},`;
  });

  return `{\n${lines.join("\n")}\n${indent}}`;
}

function formatString(value) {
  const hasNewline = /[\n\r]/.test(value);
  const hasSingleQuote = value.includes("'");
  const hasDoubleQuote = value.includes('"');

  if (hasNewline || (hasSingleQuote && hasDoubleQuote)) {
    return formatTemplateLiteral(value);
  }

  if (hasSingleQuote) {
    return `"${escapeForDoubleQuotes(value)}"`;
  }

  return `'${escapeForSingleQuotes(value)}'`;
}

function escapeCommonCharacters(value) {
  return ("" + value).replace(/["'\\\n\r\u2028\u2029]/g, function (character) {
    switch (character) {
      case '"':
      case "'":
      case "\\":
        return "\\" + character;
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case "\u2028":
        return "\\u2028";
      case "\u2029":
        return "\\u2029";
    }
  });
}

function escapeForSingleQuotes(value) {
  return escapeCommonCharacters(value);
}

function escapeForDoubleQuotes(value) {
  return ("" + value).replace(/["\\\n\r\u2028\u2029]/g, function (character) {
    switch (character) {
      case '"':
      case "\\":
        return "\\" + character;
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case "\u2028":
        return "\\u2028";
      case "\u2029":
        return "\\u2029";
    }
  });
}

function formatTemplateLiteral(value) {
  const escaped = value
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");

  return `\`${escaped}\``;
}

function formatPropertyKey(key) {
  if (/^[$A-Z_][0-9A-Z_$]*$/i.test(key)) {
    return key;
  }

  return formatString(key);
}

function formatPrimitiveValue(value) {
  if (value === null) {
    return "null";
  }

  switch (typeof value) {
    case "string":
      return formatString(value);
    case "number":
    case "boolean":
      return String(value);
    default:
      return null;
  }
}

module.exports = {
  createFileContent,
  serializePayload,
};
