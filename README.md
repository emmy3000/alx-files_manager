# 0x04. Files manager

This back-end trimester project aims to develop a comprehensive platform with a focus on authentication, NodeJS, MongoDB, Redis, pagination, and background processing. The primary objective is to create a simple file management system with the following features:

1. **User Authentication via Token:**
Implement a secure user authentication system using tokens to ensure secure access to the platform.

2. **List All Files:**
Develop functionality to retrieve and display a list of all files stored on the platform.

3. **Upload a New File:**
Enable users to upload new files to the platform, ensuring proper handling of file uploads and storage.

4. **Change Permission of a File:**
Implement the ability for authorized users to modify file permissions, enhancing the platform's security and access control.

5. **View a File:**
Create a feature that allows users to view the contents of a selected file within the platform.

6. **Generate Thumbnails for Images:**
Implement a thumbnail generation process specifically designed for images, enhancing the user experience when viewing image files.

## Base Configuration Files Provided:

**`package.json`**: 

A file in Node.js projects that holds metadata about the project, such as its name, version, dependencies (external libraries or modules required), and scripts to execute various tasks.

```JSON
{
  "name": "files_manager",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "lint": "./node_modules/.bin/eslint",
    "check-lint": "lint [0-9]*.js",
    "start-server": "nodemon --exec babel-node --presets @babel/preset-env ./server.js",
    "start-worker": "nodemon --exec babel-node --presets @babel/preset-env ./worker.js",
    "dev": "nodemon --exec babel-node --presets @babel/preset-env",
    "test": "./node_modules/.bin/mocha --require @babel/register --exit" 
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "bull": "^3.16.0",
    "chai-http": "^4.3.0",
    "express": "^4.17.1",
    "image-thumbnail": "^1.0.10",
    "mime-types": "^2.1.27",
    "mongodb": "^3.5.9",
    "redis": "^2.8.0",
    "sha1": "^1.1.1",
    "uuid": "^8.2.0"
  },
  "devDependencies": {
    "@babel/cli": "^7.8.0",
    "@babel/core": "^7.8.0",
    "@babel/node": "^7.8.0",
    "@babel/preset-env": "^7.8.2",
    "@babel/register": "^7.8.0",
    "chai": "^4.2.0",
    "chai-http": "^4.3.0",
    "mocha": "^6.2.2",
    "nodemon": "^2.0.2",
    "eslint": "^6.4.0",
    "eslint-config-airbnb-base": "^14.0.0",
    "eslint-plugin-import": "^2.18.2",
    "eslint-plugin-jest": "^22.17.0",
    "request": "^2.88.0",
    "sinon": "^7.5.0"
  }
}
```

**`.eslintrc.js`**:

A configuration file used by ESLint, a popular JavaScript linter tool. It defines rules and settings for code style, formatting, and potential errors to maintain consistency and quality within a JavaScript project.

```javascript
module.exports = {
    env: {
      browser: false,
      es6: true,
      jest: true,
    },
    extends: [
      'airbnb-base',
      'plugin:jest/all',
    ],
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
    },
    plugins: ['jest'],
    rules: {
      'max-classes-per-file': 'off',
      'no-underscore-dangle': 'off',
      'no-console': 'off',
      'no-shadow': 'off',
      'no-restricted-syntax': [
        'error',
        'LabeledStatement',
        'WithStatement',
      ],
    },
    overrides:[
      {
        files: ['*.js'],
        excludedFiles: 'babel.config.js',
      }
    ]
};
```

**`babel.config.js`**:

A configuration file for Babel, a tool used to transform (or transpile) modern JavaScript code into backward-compatible versions to ensure compatibility across different browsers or environments. This file specifies settings for Babel's transformation process.

```javascript
module.exports = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current',
          },
        },
      ],
    ],
};
```

## Dependencies Installation

Execute the npm installation command to set up the project's tools and dependencies saved in the `package.json` file:

```shell
npm install
```

## Author

Emeka Emodi
