"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jec_glasscat_cli_1 = require("jec-glasscat-cli");
const CreateRole_1 = require("../commands/CreateRole");
jec_glasscat_cli_1.CommandManager.getInstance().execute(new CreateRole_1.CreateRole());
