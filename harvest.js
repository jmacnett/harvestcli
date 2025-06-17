'use strict';

const yargs = require('yargs/yargs');
const {
    hideBin
} = require('yargs/helpers');
const cfg = require('./config');
const api = require('./apiwrapper');

// load config
cfg.loadConfig();

yargs(process.argv.slice(2))
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Run with verbose logging'
    })
    .command('configure', 'set up your local configuration', async (y) => {
        await cfg.configure();
    })
    .command('sup',
        'hello?',
        {
            cow: {
                require: false,
                describe: 'what do you think'
            }
        },
        async(y)=> {
            console.log('suuuup');
        }
    )
    .command('get-timer', 'gets your active timers', async (y) => {
         if (!cfg.isConfigured()) {
            return;
        }   
        var res = await api.getTimer(y);
        if(!res || res['total_entries'] == 0) {
            console.log('No active timers.');
        } else {
            console.log(res);
        }
    })
    .command('start-timer', 'starts a timer if none are running', async (y) =>{
        if (!cfg.isConfigured()) {
            return;
        }
        throw 'not implemented yet';
    })
    .command('stop-timer', 'stops a timer if any are running', async (y) =>{
        if (!cfg.isConfigured()) {
            return;
        }
        throw 'not implemented yet';
    })
    .demandCommand(1, 'No command specified')
    .argv
    .finally(()=> {
        //console.log("Execution complete!");
    });
