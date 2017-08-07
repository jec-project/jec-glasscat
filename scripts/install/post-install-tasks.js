"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jec_glasscat_install_1 = require("jec-glasscat-install");
let runner = new jec_glasscat_install_1.InstallTaskRunner();
let tasks = [
    new jec_glasscat_install_1.BuildDirsTask()
];
runner.addTasks(tasks);
runner.runTasks((errors) => { });
