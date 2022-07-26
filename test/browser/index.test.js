const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const htmlDir = path.join(__dirname, "html");

const http = require("http");
const open = require("open");

fs.readdir(htmlDir, function (error, files) {
    if (error) throw error;

    const htmlFiles = [];
    for (const file of files) {
        if (file.endsWith(".test.html")) {
            htmlFiles.push(file);
        }
    }

    inquirer
        .prompt([
            {
                type: "list",
                message: "Which test would you like to run?",
                name: "test",
                choices: htmlFiles,
            },
        ])
        .then((answers) => {
            const filePath = path.join(htmlDir, answers.test);
            const port = process.env.PORT || 3000;
            http.createServer(function (req, res) {
                fs.readFile(
                    path.resolve(htmlDir, req.url),
                    function (error, data) {
                        if (error) {
                            res.writeHead(404);
                            res.end(JSON.stringify(error));
                            return;
                        }
                        res.writeHead(200);
                        res.end(data);
                    }
                );
            }).listen(port);
            open(`http://localhost:${port}/${filePath}`);
        });
});
