/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import * as childProcess from 'child_process';
const spawn = childProcess.spawn;

export function spawnServer(command: string, options: { verbose?: boolean, env?: any } = {}) {
  const verbose = Boolean(options.verbose);

  const args = command.split(/\s+/g);
  const cmd = args.shift();

  const env = Object.assign({}, process.env, options.env);

  let stderr = '';
  let stdout = '';
  let stdall = '';
  let hookFired = false;
  let hookTexts: string[];
  let hookFn: () => void;

  const child = spawn(cmd as string, args, {
    env
  });

  function maybeHook() {
    if (hookFired) return;
    if (hookTexts && hookFn && hookTexts.some((hookText) => stdall.indexOf(hookText) !== -1)) {
      hookFired = true;
      hookFn();
    }
  }

  child.stderr.on('data', (data: any) => {
    var dataStr = data.toString();
    if (verbose) console.log(`ERR: ${dataStr}`);
    stderr += dataStr;
    stdall += dataStr;
    maybeHook();
  });

  child.stdout.on('data', (data: any) => {
    var dataStr = data.toString();
    if (verbose) console.log(dataStr);
    stdout += dataStr;
    stdall += dataStr;
    maybeHook();
  });

  return {
    getStderr: function () {
      return stderr;
    },
    getStdout: function () {
      return stdout;
    },
    getStdall: function () {
      return stdall;
    },
    onHook: function (texts: string[], fn: () => void) {
      hookTexts = Array.isArray(texts) ? texts : [texts];
      hookFn = fn;
    },
    kill: function () {
      child.kill('SIGHUP');
    }
  };
}
