const { spawn } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';
const pnpm = isWindows ? 'pnpm.cmd' : 'pnpm';
const fullMode = process.argv.includes('--full');

const services = fullMode
  ? [
      ['extension', './apps/extension'],
      ['orchestrator', './apps/orchestrator'],
      ['backend', './apps/backend'],
      ['frontend', './apps/frontend'],
    ]
  : [
      ['backend', './apps/backend'],
      ['frontend', './apps/frontend'],
    ];

const children = new Map();
let shuttingDown = false;
let exitCode = 0;

function writePrefixed(name, chunk, target) {
  const text = chunk.toString();
  for (const line of text.split(/\r?\n/)) {
    if (line.length) {
      target.write(`[${name}] ${line}\n`);
    }
  }
}

function killTree(child) {
  if (!child.pid || child.exitCode !== null) {
    return;
  }

  if (isWindows) {
    spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], {
      stdio: 'ignore',
      windowsHide: true,
    });
    return;
  }

  child.kill('SIGTERM');
}

function stopAll(code) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  exitCode = code;

  for (const child of children.values()) {
    killTree(child);
  }

  setTimeout(() => process.exit(exitCode), 250).unref();
}

for (const [name, filter] of services) {
  const child = spawn(pnpm, ['--filter', filter, 'run', 'dev'], {
    cwd: root,
    env: {
      ...process.env,
      FORCE_COLOR: process.env.FORCE_COLOR || '1',
    },
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: isWindows,
    windowsHide: true,
  });

  children.set(name, child);
  child.stdout.on('data', (chunk) => writePrefixed(name, chunk, process.stdout));
  child.stderr.on('data', (chunk) => writePrefixed(name, chunk, process.stderr));

  child.on('error', (error) => {
    console.error(`[${name}] ${error.message}`);
    stopAll(1);
  });

  child.on('exit', (code, signal) => {
    children.delete(name);

    if (shuttingDown) {
      return;
    }

    const failed = typeof code === 'number' ? code !== 0 : Boolean(signal);
    if (failed) {
      console.error(`[${name}] exited with ${signal || code}`);
      stopAll(typeof code === 'number' && code !== 0 ? code : 1);
    }
  });
}

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));
