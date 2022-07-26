require("dotenv").config();
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
                        if (req.url.endsWith(".html")) {
                            let html = data.toString();
                            const matches = html.match(/\[\%\s?.+\s?\%\]/g);
                            console.log(`There are ${matches.length} matches`);
                            for (const match of matches) {
                                let variable = match.replace("[%", "");
                                variable = variable.replace("%]", "");
                                variable = variable.trim();
                                const value = process.env[variable] ? process.env[variable] : "";
                                html = html.replace(match, value);
                            }
                            res.end(html);
                        } else {
                            res.end(data);
                        }
                    }
                );
            }).listen(port);
            open(`http://localhost:${port}/${filePath}`);
        });
});
