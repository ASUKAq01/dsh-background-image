#!/usr/bin/env node
/**
 * Dependency-free validation for this DSH plugin bundle.
 *
 * Checks the manifest and its exported resources, both locale dictionaries,
 * the loader patch, the icon, and the JavaScript syntax of both halves.
 * Run from anywhere: `node scripts/validate.mjs`.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = dirname(scriptDir);
const failures = [];
let passed = 0;

function check(name, run) {
  try {
    const detail = run();
    passed += 1;
    console.log(`ok   ${name}${detail ? ` — ${detail}` : ''}`);
  } catch (error) {
    failures.push(`${name}: ${error.message}`);
    console.log(`FAIL ${name} — ${error.message}`);
  }
}

function readJson(relative) {
  const path = join(root, relative);
  if (!existsSync(path)) throw new Error(`${relative} is missing`);
  return JSON.parse(readFileSync(path, 'utf8'));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function fileSize(relative) {
  const path = join(root, relative);
  if (!existsSync(path)) throw new Error(`${relative} is missing`);
  return statSync(path).size;
}

/** Expand the simple `dir/*.json` glob used by package `files` and `exports`. */
function expandGlob(pattern) {
  if (!pattern.includes('*')) return [pattern];
  const star = pattern.indexOf('*');
  const directory = pattern.slice(0, star).replace(/\/$/, '');
  const suffix = pattern.slice(star + 1);
  if (!existsSync(join(root, directory))) return [];
  return readdirNames(join(root, directory))
    .filter((name) => name.endsWith(suffix))
    .map((name) => `${directory}/${name}`);
}

function readdirNames(path) {
  return readdirSync(path);
}

const manifest = readJson('package.json');
const packageName = manifest.name;

check('package name', () => {
  assert(typeof packageName === 'string' && packageName.length > 0, 'name is missing');
  assert(
    packageName === 'dsh-background-image' ||
      /^@[a-z0-9][a-z0-9-]*\/dsh-background-image$/.test(packageName),
    `unexpected name "${packageName}"`
  );
  return packageName;
});

check('version', () => {
  assert(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(manifest.version ?? ''), 'version is not semver');
  return manifest.version;
});

check('license', () => {
  assert(manifest.license === 'MIT', 'license must be MIT');
  return 'MIT';
});

check('description', () => {
  assert(typeof manifest.description === 'string' && manifest.description.length > 20, 'description is too short');
});

check('repository metadata', () => {
  assert(manifest.repository?.url?.includes('github.com'), 'repository.url must point at GitHub');
  assert(typeof manifest.homepage === 'string', 'homepage is missing');
  assert(typeof manifest.bugs?.url === 'string', 'bugs.url is missing');
});

check('bundle manifest', () => {
  assert(manifest.dsh?.bundle?.patch === './cordis.patch.yml', 'dsh.bundle.patch is missing');
  assert(manifest.dsh?.client?.platform === 'web', 'dsh.client.platform must be web');
  assert(manifest.dsh?.client?.immediately === true, 'dsh.client.immediately should be true');
});

check('export paths', () => {
  const exports = manifest.exports ?? {};
  assert(Object.keys(exports).length > 0, 'exports is empty');
  for (const [key, value] of Object.entries(exports)) {
    const target = typeof value === 'string' ? value : value?.import ?? value?.default;
    assert(typeof target === 'string', `${key} has no file target`);
    for (const file of expandGlob(target)) {
      assert(existsSync(join(root, file)), `${key} -> ${file} does not exist`);
    }
  }
  return Object.keys(exports).join(', ');
});

check('packaged files', () => {
  assert(Array.isArray(manifest.files) && manifest.files.length > 0, 'files is empty');
  for (const entry of manifest.files) {
    if (entry.includes('*')) continue;
    assert(existsSync(join(root, entry)), `files entry ${entry} does not exist`);
  }
});

check('loader patch', () => {
  const patch = readFileSync(join(root, 'cordis.patch.yml'), 'utf8');
  assert(/id:\s*background-image\b/.test(patch), 'row id background-image is missing');
  assert(patch.includes(packageName), `patch does not reference ${packageName}`);
});

check('icon', () => {
  const size = fileSize(manifest.icon ?? 'icon.svg');
  assert(size <= 256 * 1024, `icon is ${size} bytes (limit 256 KiB)`);
  const svg = readFileSync(join(root, manifest.icon ?? 'icon.svg'), 'utf8');
  assert(svg.startsWith('<svg') && svg.includes('</svg>'), 'icon is not an SVG document');
  return `${size} bytes`;
});

for (const locale of ['en', 'zh']) {
  check(`locale ${locale}`, () => {
    const dictionary = readJson(`locale/${locale}.json`);
    assert(typeof dictionary.meta?.title === 'string' && dictionary.meta.title.length > 0, 'meta.title is missing');
    assert(
      typeof dictionary.meta?.description === 'string' && dictionary.meta.description.length > 10,
      'meta.description is missing'
    );
    return dictionary.meta.title;
  });
}

for (const file of ['index.js', 'client.js']) {
  check(`syntax ${file}`, () => {
    execFileSync(process.execPath, ['--check', join(root, file)], { stdio: 'inherit' });
  });
}

check('client module identity', () => {
  const client = readFileSync(join(root, 'client.js'), 'utf8');
  assert(client.includes(`id: '${packageName}'`), `client.js module id must be '${packageName}'`);
  assert(client.includes(`const PKG = '${packageName}'`), 'client.js PKG constant is out of sync');
  assert(!client.includes('@local/dsh-background-image'), 'client.js still references the local development name');
});

check('peer dependency', () => {
  const range = manifest.peerDependencies?.['@deepseek-ai/dsh'];
  assert(typeof range === 'string' && range.length > 0, 'peerDependencies["@deepseek-ai/dsh"] is missing');
  return range;
});

console.log('');
if (failures.length > 0) {
  console.error(`${failures.length} check(s) failed, ${passed} passed.`);
  process.exit(1);
}
console.log(`All ${passed} checks passed.`);
