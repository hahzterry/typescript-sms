#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// Load the built package by its own name, as consumers do, from both module
// systems, and check each exposes the same client and version.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { name, version } = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const probe = (code, type) => execFileSync(process.execPath, ['--input-type', type, '-e', code], { cwd: root, encoding: 'utf8' }).trim();

const required = probe(`const sdk = require(${JSON.stringify(name)}); console.log(typeof sdk.Nitrosend, sdk.VERSION)`, 'commonjs');
const imported = probe(`const sdk = await import(${JSON.stringify(name)}); console.log(typeof sdk.Nitrosend, sdk.VERSION)`, 'module');
for (const [system, output] of [['require', required], ['import', imported]]) {
  if (output !== `function ${version}`) throw new Error(`${system}('${name}') gave "${output}", expected the client and ${version}`);
}
console.log(`${name} ${version} loads with require and import`);
