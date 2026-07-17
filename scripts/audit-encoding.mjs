import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { basename, extname } from "node:path";
import { TextDecoder } from "node:util";

const textExtensions = new Set([
  ".cjs",
  ".bat",
  ".css",
  ".env",
  ".example",
  ".html",
  ".ini",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".ps1",
  ".py",
  ".scss",
  ".sh",
  ".sql",
  ".svg",
  ".toml",
  ".ts",
  ".tsx",
  ".txt",
  ".xml",
  ".yaml",
  ".yml",
]);

const textFilenames = new Set([
  ".coveragerc",
  ".env.example",
  ".gitattributes",
  ".gitignore",
  ".python-version",
  ".railwayignore",
  "Dockerfile",
  "Makefile",
  "Procfile",
]);

const suspiciousPatterns = [
  ["replacement character", /\uFFFD/u],
  ["BOM marker", /\uFEFF/u],
  ["C1 control character", /[\u0080-\u009F]/u],
  ["likely Latin-1/Windows-1252 mojibake", /(?:[\u00C2\u00C3][\u0080-\u00BF]|\u00E2\u20AC|\u00F0\u0178)/u],
];

const decoder = new TextDecoder("utf-8", { fatal: true });

function trackedTextFiles() {
  const output = execFileSync("git", ["ls-files", "-z"]);
  return output
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
    .filter((file) => {
      const name = basename(file);
      return textExtensions.has(extname(file)) || textFilenames.has(name) || name.startsWith(".env");
    });
}

function escapeNonAscii(value) {
  return Array.from(value, (char) => {
    const code = char.codePointAt(0);
    return code >= 32 && code <= 126 ? char : `\\u{${code.toString(16)}}`;
  }).join("");
}

const failures = [];

for (const file of trackedTextFiles()) {
  const bytes = readFileSync(file);
  let text;

  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    failures.push(`${file}: leading UTF-8 BOM`);
    continue;
  }

  try {
    text = decoder.decode(bytes);
  } catch {
    failures.push(`${file}: invalid UTF-8`);
    continue;
  }

  text.split(/\r?\n/u).forEach((line, index) => {
    for (const [label, pattern] of suspiciousPatterns) {
      if (pattern.test(line)) {
        failures.push(`${file}:${index + 1}: ${label}: ${escapeNonAscii(line.trim().slice(0, 160))}`);
      }
    }
  });
}

if (failures.length > 0) {
  console.error(`Encoding audit failed:\n${failures.join("\n")}`);
  process.exit(1);
}

console.log("Encoding audit passed.");
