# lectron-react-boilerplate-pasori
IC-Card entry and exit system ( electron-react-boilerplate )

# requirements for npm install

Node 20.11.1

Visual Studio 2019 Build Tools

# start

```
npm start
```

# package

## Error(1)
```
.erb\scripts\clean.js:14
foldersToRemove.forEach((folder) => {
                ^
TypeError: rimrafSync is not a function
```
## action
```:.erb/scripts/clean.js
//import { rimrafSync } from 'rimraf';
import * as rimraf from 'rimraf';
const rimrafSync = rimraf.sync;
```
## Error(2)

```
⨯ Unable to `require`  moduleName=～.erb\scripts\notarize.js message=require() of ES Module 
```

## action

```:.erb\scripts\notarize.js
//const { notarize } = require('@electron/notarize');
const { notarize } = import('@electron/notarize'); // 動的にしないとエラーになる
```

