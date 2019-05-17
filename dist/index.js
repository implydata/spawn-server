"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var childProcess = require("child_process");
var spawn = childProcess.spawn;
function spawnServer(command, options) {
    if (options === void 0) { options = {}; }
    var verbose = Boolean(options.verbose);
    var args = command.split(/\s+/g);
    var cmd = args.shift();
    var env = Object.assign({}, process.env, options.env);
    var stderr = '';
    var stdout = '';
    var stdall = '';
    var hookFired = false;
    var hookTexts;
    var hookFn;
    var child = spawn(cmd, args, {
        env: env
    });
    function maybeHook() {
        if (hookFired)
            return;
        if (hookTexts && hookFn && hookTexts.some(function (hookText) { return stdall.indexOf(hookText) !== -1; })) {
            hookFired = true;
            hookFn();
        }
    }
    child.stderr.on('data', function (data) {
        var dataStr = data.toString();
        if (verbose)
            console.log("ERR: " + dataStr);
        stderr += dataStr;
        stdall += dataStr;
        maybeHook();
    });
    child.stdout.on('data', function (data) {
        var dataStr = data.toString();
        if (verbose)
            console.log(dataStr);
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
        onHook: function (texts, fn) {
            hookTexts = Array.isArray(texts) ? texts : [texts];
            hookFn = fn;
        },
        kill: function () {
            child.kill('SIGHUP');
        }
    };
}
exports.spawnServer = spawnServer;
