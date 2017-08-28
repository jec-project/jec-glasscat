# JEC GlassCat Project

<p align="center">
  <img src="./admin/webapp/styles/assets/glasscat.png" alt="GlassCat Application Server" width="200"/>
</p>

GlassCat is a **Web Applications Server** which provides advanced functionalities for creating, building and deploying JavaScript microservices and Angular projects over NodeJS.

GlassCat is the default [JavaScript Entreprise Container](https://github.com/pechemann/JEC) _(JEC)_ implementation.

<p align="center">
    <a href="https://github.com/pechemann/JEC" title="JavaScript Entreprise Container">
    <img src="https://raw.githubusercontent.com/pechemann/JEC/master/assets/jec-logos/jec-logo.png" alt="JavaScript Entreprise Container" width="500"/>
    </a>
</p>

## Requirements

JEC GlassCat needs the following system parameters in order to work correctly:

- Node 6+
- npm 3+
- TypeScript 2+

## Installation

To install GlassCat, you have to use the [JEC Command Line Interface _(JEC-CLI)_](https://github.com/pechemann/jec-cli).
<br/>
First install [JEC-CLI](https://github.com/pechemann/jec-cli), then run the following command in the target directory:

```bash
$ jec install-glasscat
```

or use the alias:

```bash
$ jec ig
```

The server automatically starts after its installation.

To prevent automatic start of the server, use:

```bash
$ jec install-glasscat --mute
```

## Get Started with GlassCat

New to GlassCat and need help setting up and customizing the server or learning the basic building blocks? Learn your way around GlassCat and get started with your first app within minutes.

[Browse documentation >](https://github.com/pechemann/jec-glasscat/wiki)

## Update Release Notes

**Current stable release:** [0.0.6](CHANGELOG.md#jec-glasscat-0.0.6)
 
For a complete listing of release notes for all JEC GlassCat update releases, see the [CHANGELOG](CHANGELOG.md) file. 

## License
This JEC GlassCat Project is licensed under Apache 2.0. Full license text is available in [LICENSE](LICENSE).

```
Copyright 2016-2017 Pascal ECHEMANN.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
