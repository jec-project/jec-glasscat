//  DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
//
//   Copyright 2016-2017 Pascal ECHEMANN.
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

import { InstallTaskRunner, InstallTaskError, InstallTask, BuildDirsTask,
         CopyConfigFilesTask, CopyDirsTask } from "jec-glasscat-install";

/**
 * Runs tasks that install core functionalities of the GlassCat Application
 * Server, such as creating the "workspace" folder, adding default setting
 * files, etc..
 */
let runner:InstallTaskRunner = new InstallTaskRunner();
let tasks:InstallTask[] = [
  new BuildDirsTask(),
  new CopyConfigFilesTask(),
  new CopyDirsTask()
];
runner.addTasks(tasks);
runner.runTasks((errors:InstallTaskError[])=>{});
