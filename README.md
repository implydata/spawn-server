# Spawn Server

Spawns a server using node child process `spawn`.

## Usage

```javascript
var spawnServer = require('node-spawn-server');

var server = spawnServer('node src/app.js', options);

## Options
spawnServer supports the following options:

**env**: variables to apply to the process's environment
**verbose**: prints out standard stream info from the process
```
