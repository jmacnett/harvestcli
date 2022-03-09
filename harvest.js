'use strict';

const yargs = require('yargs/yargs');
const {
    hideBin
} = require('yargs/helpers');
const cfg = require('./config');
const api = require('./apiwrapper')

// load config
cfg.loadConfig();

// process arguments to find out what we're doing
yargs(hideBin(process.argv))
    .command('configure', 'set up your local configuration', () => {
        cfg.configure();
    })
    .command('get-timer', 'gets your active timers', (y) => {
        if (!cfg.isConfigured()) {
            return;
        }
        
        api.getTimer(y);
    })
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Run with verbose logging'
    }).parse();
