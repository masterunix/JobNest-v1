#!/usr/bin/env node

// Set NODE_OPTIONS before spawning react-scripts
process.env.NODE_OPTIONS = (process.env.NODE_OPTIONS || '') + ' --localstorage-file=/tmp/.localstorage';

// Spawn react-scripts with the modified environment
const { spawn } = require('child_process');
const path = require('path');

const reactScriptsPath = path.join(__dirname, '..', 'node_modules', '.bin', 'react-scripts');
const args = ['start'];

const child = spawn('node', [reactScriptsPath, ...args], {
  stdio: 'inherit',
  env: process.env,
  shell: true
});

child.on('exit', (code) => {
  process.exit(code);
});


