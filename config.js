'use strict';

const fs = require('fs');
const os = require('os');
const readline = require("readline");
const yaml = require('js-yaml');

const PAT_DIR = os.homedir() + "/.harvestcli";
const PAT_FILE = PAT_DIR + "/pat";
const PAT_ENCODING = 'utf8';

let PATConfig = {
    token: undefined,
    account: undefined
};

module.exports.current = ()=> { return PATConfig; };

module.exports.loadConfig = () => {
    if (fs.existsSync(PAT_FILE)) {
        let fileContents = fs.readFileSync(PAT_FILE, PAT_ENCODING);
        PATConfig = yaml.load(fileContents);
    }
}

module.exports.isConfigured = () => {
    if (PATConfig && PATConfig.token) {
        return true;
    }
    console.log('No personal access token has been configured!  Please run "harvest.js configure" to set up your credentials!');
    return false;
}

module.exports.configure = async () => {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Account Number [' + (PATConfig && PATConfig.account ? PATConfig.account : '') + ']: ', function(acct) {
        rl.question('Token [' + (PATConfig && PATConfig.token ? PATConfig.token : '') + ']: ', function(token) {
            PATConfig = {
                token: token,
                account: acct
            };
            //console.log(`${name}, is a citizen of ${country}`);
            rl.close();
        });
    });
    
    rl.on("close", function() {
        let yamlStr = yaml.dump(PATConfig);
        if(!fs.existsSync(PAT_DIR)) {
            fs.mkdirSync(PAT_DIR);
        }
        fs.writeFileSync(PAT_FILE, yamlStr, PAT_ENCODING);
    });    
}