const { exec } = require("child_process");
class Launcher {
    fs = require('fs');
    path = require('path');
    readline = require("readline");
    ignore = [
        "config.php",
        "rubricas/",
        "cls.JrCorreo.php",
        ".git-ftp-ignore",
        ".gitignore",
        ".favorites.json",
        "composer.json",
        "remove_cls",
        "removecls",
        "remomvecls",
        "error_log",
        ".php_",
        "(eliminar)",
        ".sql",
        ".mwb",
        ".bak"
    ];
    structure1 =
        `<?xml version="1.0" encoding="UTF-8"?>
<FileZilla3 version="3.49.1" platform="windows">
<Queue>
    <Server>`;
    structure2 =
        `
    </Server>
</Queue>
</FileZilla3>`;

    ftpSkscourses = {
        cnx: `
        <Host>104.197.242.151</Host>
        <Port>21</Port>
        <Protocol>0</Protocol>
        <Type>0</Type>
        <User>desarrolladores</User>
        <Pass encoding="base64">U21hcnQyMDIwJCNAISo=</Pass>
        <Logontype>1</Logontype>
        <PasvMode>MODE_DEFAULT</PasvMode>
        <EncodingType>Auto</EncodingType>
        <BypassProxy>0</BypassProxy>
        <Name>[WARNING!] COLEGIOS</Name>`,
        name: `COLEGIOS`
    };
    ftpAldo = {
        cnx: `
        <Host>35.237.235.163</Host>
        <Port>21</Port>
        <Protocol>0</Protocol>
        <Type>0</Type>
        <User>desarrolladores</User>
        <Pass encoding="base64">U21hcnQyMDIwJCNAISo=</Pass>
        <Logontype>1</Logontype>
        <PasvMode>MODE_DEFAULT</PasvMode>
        <EncodingType>Auto</EncodingType>
        <BypassProxy>0</BypassProxy>
        <Name>ALDO</Name>`,
        name: `ALDO`
    };
    // ftpSkstraining = {
    //     cnx: `
    //     <Host>34.72.136.232</Host>
    //     <Port>21</Port>
    //     <Protocol>0</Protocol>
    //     <Type>0</Type>
    //     <User>desarrolladores</User>
    //     <Pass encoding="base64">U21hcnQyMDIwJCNAISo=</Pass>
    //     <Logontype>1</Logontype>
    //     <PasvMode>MODE_DEFAULT</PasvMode>
    //     <EncodingType>Auto</EncodingType>
    //     <BypassProxy>0</BypassProxy>
    //     <Name>[WARNING!] COLOMBIA</Name>`,
    //     name: `COLOMBIA`
    // };
    ftpDesarrollo = {
        cnx:
            `
        <Host>34.68.37.175</Host>
        <Port>21</Port>
        <Protocol>0</Protocol>
        <Type>0</Type>
        <User>desarrolladores</User>
        <Pass encoding="base64">QXJ0bnBwJHV4</Pass>
        <Logontype>1</Logontype>
        <PasvMode>MODE_DEFAULT</PasvMode>
        <EncodingType>Auto</EncodingType>
        <BypassProxy>0</BypassProxy>
        <Name>DESARROLLO</Name>`,
        name: `DESARROLLO`

    };
    arrProjects = [
        {
            name: `SmartCourse`,
            find: `-1-smartcourse-sc-`,
            localPath: `F:\\installedPrograms\\xampp\\htdocs\\smartcourse`,
            arrFtp: [
                {
                    ftp: this.ftpSkscourses,
                    arrPath: [`smartcourse/skscourses`]
                },
                // {
                //     ftp: this.ftpAldo,
                //     arrPath: [`smartcourse/skscourses`]
                // },
                // {
                //     ftp: this.ftpSkstraining,
                //     arrPath: [`smartcourse/skscourses`]
                // },
                {
                    ftp: this.ftpDesarrollo,
                    arrPath: [`smartcourse/skscourses`]
                },
            ]
        },
        {

            name: `SKS`,
            find: `-2-smartmanager-sks-`,
            localPath: `F:\\installedPrograms\\xampp\\htdocs\\smartmanager`,
            arrFtp: [
                {
                    ftp: this.ftpSkscourses,
                    arrPath: [`smartcourse/sks`]
                },
                // {
                //     ftp: this.ftpSkstraining,
                //     arrPath: [`smartcourse/sks`]
                // },
                {
                    ftp: this.ftpDesarrollo,
                    arrPath: [`smartcourse/sks`]
                },
            ]
        },
        {
            name: `SmartEnglish`,
            find: `-3-smartenglish-se-`,
            localPath: `F:\\installedPrograms\\xampp\\htdocs\\smartenglish`,
            arrFtp: [
                {
                    ftp: this.ftpSkscourses,
                    arrPath: [
                        `smartcourse/english_adultos`,
                        `smartcourse/english_juniors`,
                    ]
                },
                // {
                //     ftp: this.ftpSkstraining,
                //     arrPath: [
                //         `smartcourse/se_adultos`,
                //     ]
                // },
                {
                    ftp: this.ftpDesarrollo,
                    arrPath: [`smartcourse/english_adultos`]
                },
            ]
        },
    ];
    choosenProjects = [];
    colors = {
        reset: "\x1b[0m",//regresa el color original
        bright: "\x1b[1m",
        Dim: "\x1b[2m",
        underscore: "\x1b[4m",
        blink: "\x1b[5m",
        reverse: "\x1b[7m",
        hidden: "\x1b[8m",

        fgBlack: "\x1b[30m",
        fgRed: "\x1b[31m",
        fgGreen: "\x1b[32m",
        fgYellow: "\x1b[33m",
        fgBlue: "\x1b[34m",
        fgMagenta: "\x1b[35m",
        fgCyan: "\x1b[36m",
        fgWhite: "\x1b[37m",

        bgBlack: "\x1b[40m",
        bgRed: "\x1b[41m",
        bgGreen: "\x1b[42m",
        bgYellow: "\x1b[43m",
        bgBlue: "\x1b[44m",
        bgMagenta: "\x1b[45m",
        bgCyan: "\x1b[46m",
        bgWhite: "\x1b[47m",
    };
    global = {
        strChangedFiles: "",
        arrIgnoredFiles: [],
        arrFilteredFiles: []
    };
    constructor() {
        this.args = process.argv;
        console.log(this.args);
    };
    launch() {
        this.askProject().then(project => {
            this.askCommits().then(({ recentCommit, oldCommit }) => {
                this.getDates(recentCommit, oldCommit, project).then(({ recentFecha, oldFecha }) => {
                    this.getChangedFiles(recentFecha, oldFecha, project).then(changedFiles => {
                        this.mkdir(project.name).then(() => {
                            this.backupOldFiles(project).then(() => {
                                let filename = `${project.name}-(${recentCommit}-${oldCommit})`;
                                let time = `--${this.getFixedDateTime()}`;
                                this.process({ changedFiles, project, filename, time }).then(() => {
                                    this.write(`./${project.name}/${filename}__${time}.txt`, this.global.strChangedFiles);
                                });
                            })
                        });
                    });
                })
            });
        });
    }
    getDateTime() {
        return new Date(new Date() - 3600 * 1000 * 5).toISOString().slice(0, 19);
    }
    getFixedDateTime() {
        return new Date(new Date() - 3600 * 1000 * 5).toISOString().slice(0, 19).replace(/:/g, '-');
    }
    getDate() {
        return new Date(new Date() - 3600 * 1000 * 5).toISOString().slice(0, 10);
    }
    askProject() {
        return new Promise((resolve, reject) => {
            this.getInput(`
            Indique el proyecto
            1 Smartcourse
            2 SKS
            3 Smartenglish
        `, (input) => {
                this.arrProjects.forEach(project => {
                    if (project.find.search(new RegExp(input, "i")) != -1) {
                        this.choosenProjects.push(project);
                    }
                });
                if (this.choosenProjects.length > 0) {
                    console.log(this.colors.fgGreen,
                        'ok - Proyecto seleccionado:',
                        this.colors.reset);
                    console.log(this.choosenProjects,);
                    resolve(this.choosenProjects[0]);
                } else {
                    console.log(this.colors.fgRed, ' ! - El proyecto no existe', this.colors.reset);
                }
            });
        })
    }
    askCommits() {
        return new Promise((resolve, reject) => {
            this.getInput(`Rango de commits: (antiguo)..(más reciente):\n`, (input) => {
                let recentCommit, oldCommit;
                let arrCommits = input.trim().split('..');
                console.log('ok - Commits seleccionados:', arrCommits);
                if (arrCommits.length > 1) {
                    recentCommit = arrCommits[1];
                    oldCommit = arrCommits[0];
                } else {
                    recentCommit = arrCommits[0];
                    oldCommit = arrCommits[0];
                }
                resolve({ recentCommit, oldCommit });
            })
        })
    }
    getDates(recentCommit, oldCommit, project) {
        return new Promise((resolve, reject) => {
            let recentFecha;
            let oldFecha;
            this.getCommitDate(recentCommit, project).then(date => {
                recentFecha = date;
                this.getCommitDate(oldCommit, project).then(date => {
                    oldFecha = date;
                    console.log('Rango de fechas: ', recentFecha, oldFecha);
                    resolve({ recentFecha, oldFecha })
                });
            });
        })
    }
    getCommitDate(commit, project) {
        return new Promise((resolve, reject) => {
            this.cmd(`git -C "${project.localPath}" show --no-patch --no-notes --pretty='%cd' ${commit}`)
                .then(rs => {
                    resolve(rs);
                });
        })
    }
    getChangedFiles(recentFecha, oldFecha, project) {
        return new Promise((resolve, reject) => {
            let changedFiles;
            let cmd = `git -C "${project.localPath}" log --since="${oldFecha}" --until="${recentFecha}" --name-only --pretty=format: | sort | uniq`;
            this.cmd(cmd).then(files => {
                changedFiles = files;
                console.log('changedFiles:', changedFiles);
                resolve(changedFiles);
            })
        })
    }
    cmd(command, noerrors) {
        return new Promise((resolve, reject) => {
            command = command.replace(/'/g, '');
            command = command.replace(/\n/g, '');
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    if (noerrors) {
                        resolve(error);
                    }
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    if (noerrors) {
                        resolve(stderr);
                    }
                    return;
                }
                resolve(stdout);
            });
        })
    }
    getInput(msg, fx) {
        this.loadRl();
        this.rl.question(msg, (input) => {
            fx(input);
            this.rl.close();
        });
    }
    loadRl() {
        this.rl = this.readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    exist(dirname) {
        if (this.fs.existsSync(`./${dirname}`)) {
            // console.log('Directory exists!');
            return true;
        } else {
            // console.log('Directory not found.');
            return false;
        }
    }
    mkdir(dirname) {
        return new Promise((resolve, reject) => {
            if (!this.exist(dirname)) {
                this.fs.mkdir(this.path.join(__dirname, `./${dirname}`), (err) => {
                    if (err) {
                        return console.error(err);
                    }
                    console.log('Directory created successfully!');
                });
            }
            resolve();
        })
    }
    backupOldFiles(project) {
        return new Promise((resolve, reject) => {
            let cmdCp = `cp ./${project.name}/*.* ./${project.name}/history/`;
            let cmdRm = `rm ./${project.name}/*.*`;
            this.mkdir(`${project.name}/history`).then(() => {
                this.cmd(cmdCp, true).then(() => {
                    this.cmd(cmdRm, true).then(() => {
                        resolve();
                    })
                });
            });
        })
    }
    write(name, text) {
        let stream = this.fs.createWriteStream(name);
        stream.once('open', function (fd) {
            stream.write(text);
            stream.end();
        });
    }
    convertPath(path) {
        let arrDir = path.split(/\//g);
        let strFixedPath = '';
        arrDir.forEach(dir => {
            strFixedPath += ` ${dir.length} ${dir}`;
        });
        return strFixedPath;
    }
    /////////////////////////////////////
    process({ changedFiles, project, filename, time }) {
        return new Promise((resolve, reject) => {
            let arrPaths = this.filter(changedFiles);
            project.arrFtp.forEach(oFtp => {
                // console.log('[[oFtp.ftp]]', oFtp.ftp);
                oFtp.arrPath.forEach(remotePath => {
                    let docXml = this.leer(oFtp.ftp.cnx, project.localPath, remotePath, arrPaths);
                    this.write(`./${project.name}/${filename}-${oFtp.ftp.name}__${time}.xml`, docXml);
                });
            });
            resolve();
        });
    }
    filter(changedFiles) {
        changedFiles = changedFiles.replace(/\r/g, "");
        changedFiles = changedFiles.replace(/\n\n/g, "");
        let arrPaths = changedFiles.split('\n');
        arrPaths = this.arrayUnique(arrPaths);
        let arrTmp = arrPaths.filter((path) => {//ignorando archivos...
            let $return = true;
            if (path != '' && path != ' ') {
                this.ignore.forEach(file => {
                    if (path.includes(file)) {
                        // console.log('IGNORANDO: ', path);
                        this.global.arrIgnoredFiles.push(path);
                        $return = false;
                    }
                });
            } else { $return = false; }
            return $return;
        });
        arrPaths = arrTmp;
        this.global.arrFilteredFiles = arrPaths;
        console.log('arrPaths', arrPaths);
        this.global.strChangedFiles = arrPaths.join("\n");
        console.log(this.colors.fgRed, `\n\n\nIGNORADOS:`);
        console.log(this.colors.reset, this.arrayUnique(this.global.arrIgnoredFiles));
        console.log(`\n\n\n[${arrPaths.length}] ARCHIVOS <=============`, this.colors.fgGreen, `(${this.choosenProjects[0].name})`);
        return arrPaths;
    }
    leer(cnx, gitPath, ftpPath, arrPaths) {
        let structure1 = this.structure1;
        structure1 += cnx;
        // console.log('arrPaths[0]', arrPaths[0]);
        arrPaths.forEach(path => {//concatena para el xml
            let localPath = path.replace(/\//g, "\\");
            structure1 += `
			<File>
				<LocalFile>${gitPath}\\${localPath}</LocalFile>`;
            let arrPathContent = path.split('/');
            // console.log('arrPathContent', arrPathContent);
            let file = arrPathContent.pop().replace(/\r/g, "");;
            structure1 += `
				<RemoteFile>${file}</RemoteFile>`;
            let remotePath = ``;
            arrPathContent.forEach(dir => {
                remotePath += ` ${dir.length} ${dir}`;
            });
            structure1 += `
				<RemotePath>1 0${this.convertPath(ftpPath)}${remotePath}</RemotePath>
				<Download>0</Download>
				<DataType>0</DataType>
			</File>`;
        });
        let result = structure1 + this.structure2;
        return result;
    }
    arrayUnique(array) {
        return [...new Set(array)];
    }
}
const oLauncher = new Launcher;
oLauncher.launch();