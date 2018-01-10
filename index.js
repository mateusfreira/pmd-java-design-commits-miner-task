const csv = require('csvtojson');
exports.run = (projectName, path, util, logger, commit, cb) => {
    const command = `cd ${path}&&$HOME/pmd/bin/run.sh pmd  -d ./ -R ${__dirname}/pmdRuleSets/goodClass.and.long.method.xml -f csv| grep "java"`;
    logger.log(`starting codesmells for ${commit.commit}`);
    util.execPromise(command).then(codeSmelsCsv => {
        return new Promise((resolve) => {
            const header = `"Problem","Package","File","Priority","Line","Description","Rule set","Rule"\n`;
            csv({}).fromString(header + (codeSmelsCsv || ''))
                .on('end_parsed', (csvRows) => {
                    resolve(csvRows);
                });
        });
    }).then((codeSmels) => {
        commit.smells = codeSmels;
    }).catch(() => {
        commit.smells = false;
        logger.error('codeSmels', `Error processing the code smells for the commit ${commit.commit}`);
    }).asCallback(cb);
};
