"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jec_glasscat_cli_1 = require("jec-glasscat-cli");
const BuildArchetype_1 = require("../commands/BuildArchetype");
jec_glasscat_cli_1.CommandManager.getInstance().execute(new BuildArchetype_1.BuildArchetype());
