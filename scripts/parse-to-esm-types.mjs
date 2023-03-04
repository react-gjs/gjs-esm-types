import { walk } from "node-os-walk";
import path from "path";
import morph from "ts-morph";
import { fileURLToPath, URL } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function morphFile(filepath, outFile) {
  return new Promise((resolve, reject) => {
    const fileVersion = path
      .basename(filepath)
      .replace(".d.ts", "")
      .replace(/.+-/, "");

    const project = new morph.Project({
      tsConfigFilePath: path.resolve(__dirname, "../tsconfig.json"),
    });

    project.addSourceFileAtPath(filepath);

    // replace import paths
    project.getSourceFiles().forEach((sourceFile) => {
      if (sourceFile.getFilePath() !== filepath) {
        project.removeSourceFile(sourceFile);
        return;
      }

      const newImports = [];

      const refs = sourceFile.getPathReferenceDirectives();
      refs.forEach((referencedFile) => {
        const importPath = referencedFile.getFileName();
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

      const firstReference = refs.shift();
      const lastReference = refs.pop();

      sourceFile.replaceText(
        [
          firstReference.getPos() - 21,
          (lastReference ? lastReference.getEnd() : firstReference.getEnd()) +
            4,
        ],
        []
      );

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
