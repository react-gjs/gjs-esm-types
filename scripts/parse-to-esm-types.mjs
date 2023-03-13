import { readFile } from "fs/promises";
import { walk } from "node-os-walk";
import path from "path";
import morph from "ts-morph";
import { fileURLToPath, URL } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function morphFile(filepath, outFile) {
  return new Promise(async (resolve, reject) => {
    const fileVersion = path
      .basename(filepath)
      .replace(".d.ts", "")
      .replace(/.+-/, "");

    const project = new morph.Project({
      tsConfigFilePath: path.resolve(__dirname, "../tsconfig.json"),
      skipAddingFilesFromTsConfig: true,
    });

    const content = await readFile(filepath, "utf-8");

    const RefRegexp = /^\/\/\/ <reference path=.+? \/>$/gm;
    const refMatches = content.match(RefRegexp);
    const refs = refMatches
      ? refMatches.map((match) => {
          const path = match.replace(
            /^\/\/\/ <reference path="(.+?)" \/>$/,
            "$1"
          );
          return path;
        })
      : [];

    const c = content.replace(RefRegexp, "");
    project.createSourceFile(filepath, c, {
      overwrite: true,
      scriptKind: morph.ScriptKind.TS,
    });

    // replace import paths
    project.getSourceFiles().forEach((sourceFile) => {
      if (sourceFile.getFilePath() !== filepath) {
        project.removeSourceFile(sourceFile);
        return;
      }
      const newImports = [];

      refs.forEach((importPath) => {
        const importFileName = path.basename(importPath);
        const nsName = importFileName.replace(".d.ts", "").replace(/-.+/, "");
        const nsVersion = importFileName
          .replace(".d.ts", "")
          .replace(/.+-/, "");

        if (nsName !== "Gjs") {
          newImports.push({
            defaultImport: nsName,
            moduleSpecifier: `gi://${nsName}?version=${nsVersion}`,
            isTypeOnly: true,
          });
        }
      });

      sourceFile.getImportDeclarations().forEach((importDeclaration) => {
        importDeclaration.remove();
      });

      sourceFile.getExportDeclarations().forEach((exportDeclaration) => {
        exportDeclaration.remove();
      });

      const defExportSym = sourceFile.getDefaultExportSymbol();
      if (defExportSym) {
        sourceFile.removeDefaultExport(defExportSym);
      }

      newImports.forEach((newImport) => {
        sourceFile.addImportDeclaration(newImport);
      });

      sourceFile.forEachChild((node) => {
        const type = node.getKind();
        const text = node.getText();
        if (
          type === morph.ts.SyntaxKind.ModuleDeclaration &&
          node.getText().startsWith("declare namespace")
        ) {
          const identifier = node.getFirstChildByKind(
            morph.ts.SyntaxKind.Identifier
          );

          const module = sourceFile.addModule({
            name: `"gi://${identifier.getText()}?version=${fileVersion}"`,
            declarationKind: morph.ModuleDeclarationKind.Module,
            hasDeclareKeyword: true,
          });

          module.addStatements(`export default ${identifier.getText()};`);
        }
      });
    });

    // save to outfile
    project.getSourceFiles().forEach((sourceFile) => {
      sourceFile
        .copyImmediately(outFile, { overwrite: true })
        .then(() => resolve())
        .catch((e) => reject(e));
    });
  });
}

async function main() {
  const srcDir = path.resolve(__dirname, "../src");
  const declarationDir = path.resolve(srcDir, "@tmp_types");

  for await (const [root, _, files] of walk(declarationDir)) {
    for (const file of files) {
      if (file.name.endsWith(".d.ts")) {
        const input = path.resolve(root, file.name);
        const rel = path.relative(declarationDir, input);
        const outFile = path.resolve(srcDir, "@types", rel);
        if (file.name !== "Gjs.d.ts" && file.name !== "index.d.ts") {
          console.log("Transforming file:", rel);
          await morphFile(input, outFile);
        }
      }
    }
  }
}

main();
