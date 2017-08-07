"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jec_glasscat_cli_1 = require("jec-glasscat-cli");
const StartServer_1 = require("../commands/StartServer");
jec_glasscat_cli_1.CommandManager.getInstance().execute(new StartServer_1.StartServer());
