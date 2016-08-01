# Spawn Server

Spawns a server using node child process [`spawn`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options).

## Usage

```javascript
var spawnServer = require('node-spawn-server');

var server = spawnServer('node src/app.js', options);
```

## Options
spawnServer supports the following options:

**env**: variables to add to the process's environment

**verbose**: true/false, if you want print outs of the process's standard stream info