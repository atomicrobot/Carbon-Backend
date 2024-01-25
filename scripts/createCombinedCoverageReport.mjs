import { copyFileSync, lstatSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

process.stdout.write('Consolidating test coverage reports...');

const coverageDir = 'coverage';
const coverageFinal = 'coverage-final.json';
const coverageAllFile = 'coverage-all-temp.json';
const coverageRoot = ['.', coverageDir];

const coverageContents = readdirSync(join(...coverageRoot));
coverageContents.forEach((content) => {
    const stat = lstatSync(join(...coverageRoot, content));
    if (stat.isDirectory()) {
        const coverageFiles = readdirSync(join(...coverageRoot, content));
        coverageFiles.forEach((coverageFile) => {
            if (coverageFile === coverageFinal) {
                copyFileSync(
                    join(...coverageRoot, content, coverageFile),
                    join(...coverageRoot, `${content}-temp.json`),
                );
            }
        });
    } else {
        // Remove any non-coverage files
        unlinkSync(join(...coverageRoot, content));
    }
});

// Merge and generate the coverage report
execSync(`npx nyc merge ${coverageDir} ${coverageDir}/${coverageAllFile}`);
execSync(`npx nyc report -t coverage --reporter html`);

// Cleanup our temp files
const updatedCoverageContents = readdirSync(join(...coverageRoot));
updatedCoverageContents.forEach((contents) => {
    if (contents.includes('-temp.json')) {
        unlinkSync(join(...coverageRoot, contents));
    }
});

process.stdout.write('done!\n');
