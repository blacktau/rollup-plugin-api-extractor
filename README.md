# rollup-plugin-api-extractor

![Build Status](https://github.com/blacktau/rollup-plugin-api-extractor/workflows/CI%20Pipeline/badge.svg)
[![codecov](https://codecov.io/gh/blacktau/rollup-plugin-api-extractor/branch/main/graph/badge.svg?token=O1NDBJ7V2K)](https://codecov.io/gh/blacktau/rollup-plugin-api-extractor)

This is a [rollup](https://www.rollupjs.org/) plugin to integrate [@microsoft/api-extractor](https://api-extractor.com/) into the rollup build system.

## Usage

Install the package and @microsoft/api-extractor with npm (or yarn):

`npm`

```bash
npm install --save-dev rollup-plugin-api-extractor @microsoft/api-extractor
```

`yarn`

```bash
yarn add --dev rollup-plugin-api-extractor @microsoft/api-extractor
```

Add to rollup config:

```javascript
import typescript from "@rollup/plugin-typescript";
import apiExtractor from "rollup-plugin-api-extractor";

export default [
  {
    input: "src/index.ts",
    output: [(dir: "dist"), (format: "esm")],
    plugins: [typescript(), apiExtractor()],
  },
];
```

### Configure for api-extractor

The below is based on the example at [https://api-extractor.com/pages/setup/invoking/](https://api-extractor.com/pages/setup/invoking/):

Add the `typings` or `types` field to `package.json`:

```json
{
  //...
  "types": "lib/index.d.ts"
  //...
}
```

Make sure `"declaration": true` and `"declarationMap": true` are in set in your `tsconfig.json`.

Generate the api-extractor configuration:

`npx`

```bash
npx api-extractor init
```

or

`yarn`

```bash
yarn api-extractor init
```

Update the generated `api-extractor.json` so that `mainEntryPointFilePath` matches the `typings`/`types` field in `package.json`

```json
"mainEntryPointFilePath": "<projectFolder>/lib/index.d.ts",
```

If `api-extractor.json` is not in the `config` folder update the `apiExtractor()` in your `rollup.config.js` to reference it:

```javascript
import typescript from "@rollup/plugin-typescript";
import apiExtractor from "rollup-plugin-api-extractor";

export default [
  {
    input: "src/index.ts",
    output: [(dir: "dist"), (format: "esm")],
    plugins: [
      typescript(),
      apiExtractor({
        configFile: "./api-extractor.json",
      }),
    ],
  },
];
```

## Plugin Configuration Options

The plugin Options are as follows:

| Option           | Default                       | Description                                                                                                                                                                                                 |
| ---------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| configFile       | './config/api-extractor.json' | The path to the api extractor configuration file.                                                                                                                                                           |
| configuration    |                               | the configuration for `@microsoft/api-extractor`. If both `configFile` and this are specified, paramters specified here will override those in the configuration file.                                      |
| local            | false                         | Indicates that API Extractor is running as part of a local build. Equates to `--local` in [api-extractor run](https://api-extractor.com/pages/commands/api-extractor_run/) command line.                    |
| verbose          | false                         | Show additional informational messages in the output. Equates to `--verbose` in [api-extractor run](https://api-extractor.com/pages/commands/api-extractor_run/) command line.                              |
| diagnostics      | false                         | Show diagnostic messages used for troubleshooting problems with API Extractor. Equates to `--diagnostics` in [api-extractor run](https://api-extractor.com/pages/commands/api-extractor_run/) command line. |
| typescriptFolder |                               | Used to override the typescript compiler folder for `@microsoft/api-extractor`. Equates to `--typescript-compiler-folder` in [api-extractor run](https://api-extractor.com/pages/commands/) command line.   |

### `configuration` and `configFile` parameters

As mentioned above, the plugin can take the `@microsoft/api-extractor` configuration as part of the options for it. If no `configFile` is specified the below are the minimum configuration parameters currently require by `@microsoft/api-extractor`:

```javascript
import typescript from "@rollup/plugin-typescript";
import apiExtractor from "rollup-plugin-api-extractor";

export default [
  {
    input: "src/index.ts",
    output: [(dir: "dist"), (format: "esm")],
    plugins: [
      typescript(),
      apiExtractor({
        configuration: {
          projectFolder: ".",
          compiler: {
            tsconfigFilePath: "<projectFolder>/tsconfig.json",
          },
        },
      }),
    ],
  },
];
```

If `configFile` and `configuration` are both specified, the configuration file is read with the `configuration` acting as an overlay or override of the parameters that are in the file.

## Why?

While there are already [rollup](https://www.rollupjs.org/) plugins for rolling up the type definitions in a package, [@microsoft/api-extractor](https://api-extractor.com/) does more. In addition, `@microsoft/api-extractor` has the ability to "trim" the type definitions to excluded APIs not meant for external consumption.

## Alternatives

- [rollup-plugin-dts](https://github.com/Swatinem/rollup-plugin-dts)
- [rollup-plugin-ts](https://github.com/wessberg/rollup-plugin-ts)

## License

This code is licensed under the MIT License.
