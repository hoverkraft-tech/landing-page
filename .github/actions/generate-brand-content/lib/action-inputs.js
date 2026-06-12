function assertCore(core) {
  if (!core || typeof core.info !== 'function') {
    throw new Error('@actions/core instance must be provided');
  }
}

function assertIO(io) {
  if (!io || typeof io.mkdirP !== 'function') {
    throw new Error('@actions/io instance with mkdirP must be provided');
  }
}

function parseJsonInput(name, rawValue) {
  if (rawValue === undefined || rawValue === '') {
    throw new Error(`Input ${name} is required`);
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    throw new Error(`Failed to parse ${name} input: ${error.message}`);
  }
}

function requireTrimmedString(name, value) {
  const resolvedValue = (value ?? '').trim();

  if (!resolvedValue.length) {
    throw new Error(`${name} input is required`);
  }

  return resolvedValue;
}

module.exports = {
  assertCore,
  assertIO,
  parseJsonInput,
  requireTrimmedString,
};
