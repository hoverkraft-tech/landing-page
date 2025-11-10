import { finalize, prepare } from './tasks.mjs';

async function main() {
  const mode = process.argv[2];

  if (mode === 'prepare') {
    await prepare();
    return;
  }

  if (mode === 'finalize') {
    await finalize();
    return;
  }

  console.error('Usage: node ./scripts/generate-downloadable-assets/index.mjs <prepare|finalize>');
  process.exitCode = 1;
}

main().catch((error) => {
  console.error('✗ Failed to generate download assets');
  console.error(error);
  process.exit(1);
});
