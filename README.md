# Webhooks-Microservice

ThinBlock's Webhooks MicroService is built on restify framework. It depends on NodeJS server `v8.11.2` and tests are written with `chai` and runner is `mocha`. The database is MongoDb with mongoose ORM. We use TypeScript langauge to write strongly typed code which has less chances of breaking and better intellisense support in VS Code.

## Installation
We use `yarn` to install the packages. Do
```
 yarn install
```
in the project's directory. After installing you need to set up environment variables. In Unix based systems you can do:
```
 export TB_WORKERS_REDIS_DB_STRING="Redis connection string here"
```

> Contact the collaborators to get remote db string and node string.

## Starting Development Server
To start the development server do
```
 yarn start
```
To watch the typescript files you can use `nodemon`, if you don't have `nodemon` installed you can install it via
```
 yarn add nodemon -g
 // now start watching, do this in project's directory
 nodemon
```

## File Structure
```
 - app
 	- interfaces (interfaces gives better intellisense and strong type)
	 	- utils (typescript interfaces for utils goes here)
		 models.ts (interfaces for model goes here)
	 - middlewares (middlewares go here)
	 - models (add models here, it should contain .model at the end of the file)
	 - modules
	 	- some_module (modules go here, it should be abstracted as domain)
		 	- some_module.listener.ts
			 - some_module.route.ts
			 - some_module.unit.spec.ts
 - config (Config related stuff)
 - scripts (deployment/packaging related stuff)
 - types (When types for certain package doesn't exist, add that package here)
 - utils (Utilities and helpers
 server.ts
 package.json
```
## Adding New Package
When adding new libraries/packages, you should install its types too. If its types don't exist then you should add that package to `types/types.ts`
```
 yarn add some-package @types/some-package
```

## Testing
Every module should be battle tested so that we avoid any bugs. We have CI integrated, whenever introducing new feature. We'll run the tests before merging any stuff. You should make sure all tests pass.
You can run tests by doing
```
 yarn run test
```

It'll run all the tests, if you want to run your specific test. You can do this
```
 describe.only()
 or
 it.only()
```

