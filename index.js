const csv = require('csvtojson');
exports.run = (projectName, path, util, logger, commit, cb) => {
    const command = `cd ${path}&&$HOME/pmd/bin/run.sh pmd  -d ./ -R ${__dirname}/pmdRuleSets/java-design.xml -f csv| grep "java"`;
    logger.log(`starting codesmells for ${commit.commit}`);
    util.execPromise(command).then(codeSmelsCsv => {
        return new Promise((resolve) => {
            const header = `"Problem","Package","File","Priority","Line","Description","Rule set","Rule"\n`;
            csv({}).fromString(header + (codeSmelsCsv || ''))
                .on('end_parsed', (csvRows) => {
                    resolve(csvRows);
                });
        });
    }).then((codeSmells) => {
        commit.smellsCount = codeSmells.length;
        commit.smells = codeSmells;
    }).catch((e) => {
        commit.smells = false;
        logger.log(e);
        logger.log(`Error processing the code smells for the commit ${commit.commit}`);
    }).asCallback(cb);
};

exports.export = (projectName, path, commits, util, logger, cb) => {
    const resultFileName = `${path}/${projectName}_result.json`;
    util.writeObject(commits, resultFileName).then(() => {
        return util.execPromise(`python3 ${__dirname}/chart.py ${resultFileName}`);
    }).asCallback(cb);
}
