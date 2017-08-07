"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jec_glasscat_cli_1 = require("jec-glasscat-cli");
const CreateBootstrapFile_1 = require("../commands/CreateBootstrapFile");
jec_glasscat_cli_1.CommandManager.getInstance().execute(new CreateBootstrapFile_1.CreateBootstrapFile());
