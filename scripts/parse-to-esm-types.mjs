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

      const toRemove = [];

      sourceFile.forEachChild((node) => {
        const type = node.getKind();
        const text = node.getText();
        if (
          type === morph.ts.SyntaxKind.ModuleDeclaration &&
          text.startsWith("declare namespace")
        ) {
          const identifier = node.getFirstChildByKind(
            morph.ts.SyntaxKind.Identifier
          );

          const modName = identifier.getText();

          const module = sourceFile.addModule({
            name: `"gi://${modName}?version=${fileVersion}"`,
            declarationKind: morph.ModuleDeclarationKind.Module,
            hasDeclareKeyword: true,
          });

          const nsStatements = node
            .asKind(morph.ts.SyntaxKind.ModuleDeclaration)
            .getStatements();

          module.addStatements(
            nsStatements.map((s) => {
              const commentRange = s.getLeadingCommentRanges()[0];
              const commentText = commentRange?.getText();

              return commentText
                ? commentText + "\n" + s.getText()
                : s.getText();
            })
          );

          // module.addStatements(`declare const ${modName}: {
          //   ${nsStatements
          //     .map((statement) => {
          //       /** @type {string} */
          //       const { name, reference } = (() => {
          //         const kind = statement.getKind();
          //         switch (kind) {
          //           case morph.ts.SyntaxKind.InterfaceDeclaration:
          //           case morph.ts.SyntaxKind.TypeAliasDeclaration:
          //           case morph.ts.SyntaxKind.EnumDeclaration:
          //           case morph.ts.SyntaxKind.ModuleDeclaration:
          //           case morph.ts.SyntaxKind.ClassDeclaration:
          //             return {
          //               name: statement.getName(),
          //               reference: statement.getName(),
          //             };
          //           case morph.ts.SyntaxKind.FunctionDeclaration:
          //             return {
          //               name: statement.getName(),
          //               reference: "typeof " + statement.getName(),
          //             };
          //           case morph.ts.SyntaxKind.VariableStatement:
          //             const varName = statement
          //               .asKind(morph.ts.SyntaxKind.VariableStatement)
          //               .getDeclarations()[0]
          //               .getName();

          //             return {
          //               name: varName,
          //               reference: "typeof " + varName,
          //             };
          //         }

          //         throw new Error(
          //           "Unknown statement. " + statement.getKindName()
          //         );
          //       })();

          //       return {
          //         name,
          //         reference,
          //         statement,
          //       };
          //     })
          //     // remove duplicate names
          //     .filter((v, i, a) => a.findIndex((t) => t.name === v.name) === i)
          //     .map(({ name, reference }) => {
          //       return `${name}: ${reference}`;
          //     })
          //     .join(";\n")},
          // }`);

          // module.addStatements(`export default ${modName};`);

          toRemove.push(node);
        }
      });

      toRemove.forEach((node) => {
        node.remove();
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
