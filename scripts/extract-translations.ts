/* eslint-disable no-console */
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import * as ts from 'typescript';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

enum Colors {
  Reset = '\x1b[0m',
  Bright = '\x1b[1m',
  Dim = '\x1b[2m',
  Underscore = '\x1b[4m',
  Blink = '\x1b[5m',
  Reverse = '\x1b[7m',
  Hidden = '\x1b[8m',

  FgBlack = '\x1b[30m',
  FgRed = '\x1b[31m',
  FgGreen = '\x1b[32m',
  FgYellow = '\x1b[33m',
  FgBlue = '\x1b[34m',
  FgMagenta = '\x1b[35m',
  FgCyan = '\x1b[36m',
  FgWhite = '\x1b[37m',

  BgBlack = '\x1b[40m',
  BgRed = '\x1b[41m',
  BgGreen = '\x1b[42m',
  BgYellow = '\x1b[43m',
  BgBlue = '\x1b[44m',
  BgMagenta = '\x1b[45m',
  BgCyan = '\x1b[46m',
  BgWhite = '\x1b[47m',
}

function colorize(text: string, color: Colors): string {
  return `${color}${text}${Colors.Reset}`;
}

function findProjectRoot(startPath: string): string | null {
  let currentPath = startPath;

  while (currentPath !== path.parse(currentPath).root) {
    if (fs.existsSync(path.join(currentPath, 'package.json'))) {
      return path.join(currentPath, 'src');
    }

    currentPath = path.dirname(currentPath);
  }

  return null;
}

function findDefaultDestination(sourcePath: string): string | null {
  const sourceProjectPath = sourcePath.endsWith('src') ? path.dirname(sourcePath) : sourcePath;

  return path.join(sourceProjectPath, 'src', 'assets', 'i18n');
}

function getDefaultLanguages(sourcePath: string): string[] | null {
  const filePath = path.join(sourcePath, 'environments', 'base-environment.ts');
  const content = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);

  let languages: string[] | null = null;

  ts.forEachChild(sourceFile, function visit(node) {
    if (ts.isVariableStatement(node)) {
      const declarationList = node.declarationList;

      for (const declaration of declarationList.declarations) {
        if (ts.isVariableDeclaration(declaration) && declaration.name.getText() === 'baseEnvironment') {
          const objectLiteral = <ts.ObjectLiteralExpression>declaration.initializer;

          for (const property of objectLiteral.properties) {
            if (ts.isPropertyAssignment(property) && property.name.getText() === 'languages') {
              if (ts.isArrayLiteralExpression(property.initializer)) {
                languages = property.initializer.elements.map(element => element.getText().replace(/['"]/g, ''));
              }
            }
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  });

  return languages;
}

async function askQuestion(query: string, validator: (answer: string) => boolean, defaultValue?: string): Promise<string> {
  return new Promise((resolve) => {
    function loop(): void {
      rl.question(query, (answer) => {
        if (!answer && defaultValue) {
          resolve(defaultValue);
        }
        else if (validator(answer)) {
          resolve(answer);
        }
        else {
          loop();
        }
      });
    }

    loop();
  });
}

function deepMerge(obj1: Record<string, any>, obj2: Record<string, any>): Record<string, any> {
  const output = { ...obj1 };

  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (typeof obj2[key] === 'object' && obj2[key] !== null && !Array.isArray(obj2[key]) && obj1.hasOwnProperty(key) && typeof obj1[key] === 'object') {
        output[key] = deepMerge(obj1[key], obj2[key]);
      }
      else {
        output[key] = obj2[key];
      }
    }
  }

  return output;
}

async function updateJsonFile(destinationFilePath: string, newValues: Record<string, any>): Promise<void> {
  let currentJson = {};

  if (fs.existsSync(destinationFilePath)) {
    const currentContent = fs.readFileSync(destinationFilePath, 'utf-8');

    currentJson = JSON.parse(currentContent);
  }

  // Deep merge the current JSON with the new values
  const mergedJson = deepMerge(currentJson, newValues);

  // Order the keys in ascending order
  const orderedJson: Record<string, any> = {};

  Object.keys(mergedJson).sort().forEach(key => {
    orderedJson[key] = mergedJson[key];
  });

  // Write the ordered JSON back to the destination file
  fs.writeFileSync(destinationFilePath, JSON.stringify(orderedJson, null, 2));
}

function transformToUppercase(input: string): string {
  // Convert camelCase to CAMEL_CASE
  let result = input.replace(/([a-z])([A-Z])/g, '$1_$2');

  // Convert to uppercase
  result = result.toUpperCase();

  return result;
}

function getValueFromJSON(key: string, json: Record<string, any>): any {
  const keys = key.split('.');
  let result = json;

  for (const k of keys) {
    if (result && result.hasOwnProperty(k)) {
      result = result[k];
    }
    else {
      return undefined;
    }
  }

  return result;
}

async function processTranslation(
  key: string,
  languages: string[],
  destination: string,
  filePath: string,
  lineNumber?: number,
  columnNumber?: number,
): Promise<void> {
  const transformedValue = transformToUppercase(key);

  const fileName = path.basename(filePath);

  let locationInfo = '';

  if (lineNumber !== undefined && columnNumber !== undefined) {
    locationInfo = `:${lineNumber}:${columnNumber}`;
  }

  console.log(`${colorize('[FOUND]', Colors.FgGreen)} ${fileName}${locationInfo} :`, transformedValue);

  for (const lang of languages) {
    const destLangFile = path.join(destination, `${lang}.json`);

    if (fs.existsSync(destLangFile)) {
      const destContent = fs.readFileSync(destLangFile, 'utf-8');
      const destJson = JSON.parse(destContent);
      const valueInJson = getValueFromJSON(transformedValue, destJson);

      if (!valueInJson || transformedValue === valueInJson) {
        const userTranslation = await askTranslation(transformedValue, lang);

        await updateJsonFile(destLangFile, transformToNestedObject(transformedValue, userTranslation));
      }
      else {
        console.log(`\t${colorize(`[${lang}]`, Colors.FgGreen)}`, valueInJson);
      }
    }
  }
}

function transformToNestedObject(key: string, value: string): Record<string, any> {
  const keys = key.split('.');
  const result: Record<string, any> = {};

  let currentObject = result;

  for (let i = 0; i < keys.length - 1; i++) {
    currentObject[keys[i]] = {};
    currentObject = currentObject[keys[i]];
  }

  currentObject[keys[keys.length - 1]] = value;

  return result;
}

async function askTranslation(key: string, lang: string): Promise<string> {
  return await askQuestion(`\t${colorize(`[${lang}]`, Colors.FgCyan)} ${key} (default: ${key}): `, (answer) => !!answer, key);
}

function getLineAndColumn(node: ts.Node): { lineNumber: number; columnNumber: number } {
  const { line, character } = ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart());
  return { lineNumber: line + 1, columnNumber: character + 1 };
}

interface ITSRecord {
  key: string,
  lineNumber: number,
  columnNumber: number,
}

async function processTSFile(filePath: string, destination: string, languages: string[]): Promise<void> {
  if (filePath.endsWith('.spec.ts')) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);

  const translationsToProcess: ITSRecord[] = [];
  const TRANSLATION_KEY_REGEX = /^'([A-Za-z_.]+?)'$/;

  ts.forEachChild(sourceFile, function visit(node) {
    if (ts.isCallExpression(node)) {
      if (node.expression.getText() === 'DatatableHelper.build') {
        // console.log(filePath, node.arguments.length);
        // node.arguments.forEach(arg => {
        //   console.log('Argument:', arg.getText());
        // });
      }
      else if (node.expression.getText().endsWith('.instant')) {
        if (node.arguments.length >= 1) {
          const instantMatch = TRANSLATION_KEY_REGEX.exec(node.arguments[0].getText());

          if (instantMatch) {
            translationsToProcess.push({
              key: instantMatch[1],
              ...getLineAndColumn(node),
            })
          }
        }
        else {
          for (const argument of node.arguments) {
            // console.log(argument.getText(), TRANSLATION_KEY_REGEX.test(argument.getText()));
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  });

  if (translationsToProcess.length > 0) {
    for (const translationToProcess of translationsToProcess) {
      await processTranslation(translationToProcess.key, languages, destination, filePath, translationToProcess.lineNumber, translationToProcess.columnNumber);
    }
  }
}

async function processHTMLFile(filePath: string, destination: string, languages: string[]): Promise<void> {
  const content = fs.readFileSync(filePath, 'utf-8');
  const regex = /'([^']+)'\s*\|\s*translate/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const lineNumber = content.substring(0, match.index).split('\n').length;
    const columnNumber = match.index - content.lastIndexOf('\n', match.index) - 1;

    await processTranslation(match[1], languages, destination, filePath, lineNumber, columnNumber);
  }
}

async function processFiles(source: string, destination: string, languages: string[]): Promise<void> {
  const files = fs.readdirSync(source);

  for (const file of files) {
    const filePath = path.join(source, file);

    if (file.endsWith('.ts')) {
      await processTSFile(filePath, destination, languages);
    }
    else if (file.endsWith('.html')) {
      await processHTMLFile(filePath, destination, languages);
    }

    // If there are subdirectories, you can recursively call processFiles
    if (fs.statSync(filePath).isDirectory()) {
      await processFiles(filePath, destination, languages);
    }
  }
}

let sourceFolder = findProjectRoot(path.dirname(require.main!.filename)) || path.dirname(require.main!.filename);
let destinationFolder = findDefaultDestination(sourceFolder) || path.join(sourceFolder, '..');

async function main(): Promise<void> {
  const args = process.argv.slice(2); // Get command-line arguments, skipping "node" and the script name

  // Check if the --default parameter is present
  const useDefaultValues = args.includes('--default');

  if (!useDefaultValues) {
    sourceFolder = await askQuestion(`Please specify the source folder (default: ${sourceFolder}): `, (answer) => {
      if (!answer) {
        return true;
      } // Allow default

      return fs.existsSync(answer);
    }) || sourceFolder;

    destinationFolder = await askQuestion(`Please specify the destination folder (default: ${destinationFolder}): `, (answer) => {
      if (!answer) {
        return true;
      } // Allow default

      return fs.existsSync(answer);
    }) || destinationFolder;
  }

  const defaultLanguages = getDefaultLanguages(sourceFolder);
  const languagesInput = useDefaultValues ? null : await askQuestion(`Please specify the languages to generate (default: ${defaultLanguages?.join(', ')}): `, (answer) => !!answer || !!defaultLanguages);
  let languages = languagesInput ? languagesInput.split(',').map(lang => lang.trim()) : defaultLanguages!;

  // If no valid languages left, exit the script
  if (languages.length === 0) {
    console.error('No valid languages found. Exiting.');
    process.exit(1);
  }

  await processFiles(path.join(sourceFolder, 'app'), destinationFolder, languages);

  rl.close();
}

main();
