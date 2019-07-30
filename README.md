# EPI-USE Technical Assessment Project Client

[Live Application](https://epi-use-assessment.herokuapp.com)

[Documentation](https://evansmatthew97.github.io/epi-use-assessment-client/)

[User Manual](user-manual.pdf)

[Server Repository](https://github.com/EvansMatthew97/epi-use-assessment-server)

## Description
Client source for EPI-USE technical assessment project. The client-side code provides a user interface created in Angular which consumes the server API.

Useful information regarding the use of endpoints can be found in the documentation link provided above.

This repository is configured to automatically deploy to Heroku, run unit tests and deploy documentation to Github pages.

![System screenshot](https://i.imgur.com/U3Eq3zu.png)

### Technology choices
This project is coded using **Angular**. Angular provides a modular MVC framework for cross-platform web development. It has a rich ecosystem (npm) and large community support. Being web-based, it can be deployed to the web as well as desktop (using Electron.js) and mobile (using Cordova). This makes future deployment simpler using a single code base.

**Express.js** is used to host the application on **Heroku**. Express is simple and fast to set up, but also reasonably secure with a large community backing it. Heroku is free and provides continuous deployment for this project.

## Development
### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Tests
**Note no tests have been implemented yet**
### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

#### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
