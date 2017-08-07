"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jec_glasscat_core_1 = require("jec-glasscat-core");
const jec_commons_1 = require("jec-commons");
class GlassCat {
    constructor() {
        this._kernel = null;
    }
    runProcesses() {
        this.initKernel();
        this.initLogger();
        this.checkConfig();
        this.initServices();
        this.startServices();
        jec_glasscat_core_1.LoggerManager.getInstance().info(jec_glasscat_core_1.LocaleManager.getInstance().get("server.ready"));
    }
    killProcesses() {
        this._kernel.stopServices();
        this._kernel = null;
        jec_glasscat_core_1.LoggerManager.getInstance().info(jec_glasscat_core_1.LocaleManager.getInstance().get("server.stop"));
    }
    initKernel() {
        this._kernel = new jec_glasscat_core_1.Kernel();
        this._kernel.initContext();
    }
    initLogger() {
        new jec_glasscat_core_1.LoggerManagerBuilder().context(this._kernel.getContext()).build();
    }
    checkConfig() {
        new jec_glasscat_core_1.ContextValidator().validate(this._kernel);
        new jec_glasscat_core_1.EnvironmentValidator().validate(this._kernel);
        jec_glasscat_core_1.LoggerManager.getInstance().info(jec_glasscat_core_1.LocaleManager.getInstance().get("singleton.info", "[JcadContextManager]", jec_commons_1.JcadContextManager.getInstance().getId()));
        jec_glasscat_core_1.LoggerManager.getInstance().info(jec_glasscat_core_1.LocaleManager.getInstance().get("singleton.info", "[DecoratorConnectorManager]", jec_commons_1.DecoratorConnectorManager.getInstance().getId()));
    }
    initServices() {
        this._kernel.initServices();
    }
    startServices() {
        this._kernel.startServices();
    }
    start() {
        this.runProcesses();
    }
    stop() {
        this.killProcesses();
    }
}
exports.GlassCat = GlassCat;
;
