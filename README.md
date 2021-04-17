little-library-cli
==================

A little library management system based on MySQL

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/little-library-cli.svg)](https://npmjs.org/package/little-library-cli)
[![Downloads/week](https://img.shields.io/npm/dw/little-library-cli.svg)](https://npmjs.org/package/little-library-cli)
[![License](https://img.shields.io/npm/l/little-library-cli.svg)](https://github.com/frothywater/little-library-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g little-library-cli
$ little-library COMMAND
running command...
$ little-library (-v|--version|version)
little-library-cli/0.1.0 darwin-x64 node-v15.7.0
$ little-library --help [COMMAND]
USAGE
  $ little-library COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`little-library hello [FILE]`](#little-library-hello-file)
* [`little-library help [COMMAND]`](#little-library-help-command)

## `little-library hello [FILE]`

describe the command here

```
USAGE
  $ little-library hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ little-library hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/frothywater/little-library-cli/blob/v0.1.0/src/commands/hello.ts)_

## `little-library help [COMMAND]`

display help for little-library

```
USAGE
  $ little-library help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- commandsstop -->
