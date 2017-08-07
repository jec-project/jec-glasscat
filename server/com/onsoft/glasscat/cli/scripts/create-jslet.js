"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jec_glasscat_cli_1 = require("jec-glasscat-cli");
const CreateJslet_1 = require("../commands/CreateJslet");
jec_glasscat_cli_1.CommandManager.getInstance().execute(new CreateJslet_1.CreateJslet());
