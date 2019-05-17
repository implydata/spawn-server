export declare function spawnServer(command: string, options?: {
    verbose?: boolean;
    env?: any;
}): {
    getStderr: () => string;
    getStdout: () => string;
    getStdall: () => string;
    onHook: (texts: string[], fn: () => void) => void;
    kill: () => void;
};
