#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// dist/cjs is the require() build; this marks its .js files as CommonJS inside
// a package whose own type is module.
const __dirname = dirname(fileURLToPath(import.meta.url));
writeFileSync(resolve(__dirname, '..', 'dist', 'cjs', 'package.json'), `${JSON.stringify({ type: 'commonjs' })}\n`);
