const { detectProjects } = require('lerna/utils');
const fs = require('node:fs/promises');
const path = require('node:path');
const { exit } = require('node:process');
const tempFileName = './temp_readme_config.json';
async function createTempFile() {
    const nodes = (await detectProjects()).projectGraph.nodes;
    const packageNames = Object.keys(nodes);
    function createVersionLabel(packageName) {
        const encodedName = encodeURIComponent(packageName);
        return (
            `<a href="https://badge.fury.io/js/${encodedName}"><img alt="npm version" ` +
            `src="https://badge.fury.io/js/${encodedName}.svg" height="20"/></a>`
        );
    }
    const dataArray = [['Name', 'Description', 'Version']].concat(
        packageNames.map((packageName) => {
            const package = nodes[packageName].package;
            const relativePath = package['homepage']
                ? package['homepage']
                : `https://github.com/donmahallem/turbo/tree/master/${path.relative(package.rootPath, package.location)}`;
            const name = package.name;
            const description = package.description;
            const version = package.version;
            return [`[${name}](${relativePath})`, description ? description : ' - ', version ? createVersionLabel(name) : ' - '];
        })
    );
    console.log('dat', dataArray);

    await fs.writeFile(tempFileName, JSON.stringify({ toc_data: dataArray }));
    console.log(`Created config for ${dataArray.length - 1} Packages`);
}

async function deleteTempFile() {
    await fs.unlinkSync(tempFileName);
    console.log(`Deleted temp file`);
}
if (process.argv[2] === 'clear') {
    deleteTempFile();
} else {
    createTempFile()
        .then(() => {
            console.log('A');
            exit();
        })
        .catch(console.error);
}
