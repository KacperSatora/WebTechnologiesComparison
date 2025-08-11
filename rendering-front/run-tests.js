/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const resultsDir = path.join(__dirname, "results");
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir);
}

const csvFile = path.join(resultsDir, "results.csv");
fs.writeFileSync(csvFile, "mode,network,run,ttfb,fcp,lcp,cls,tti\n");

const urls = [
  { label: "CSR", url: "http://localhost:3000/csrGallery" },
  { label: "SSR", url: "http://localhost:3000/ssrGallery" },
];

const networks = [
  { label: "unthrottled", args: "--throttling-method=provided" },
  {
    label: "fast4g",
    args: "--throttling-method=devtools --throttling.rttMs=150 --throttling.downloadThroughputKbps=4096 --throttling.uploadThroughputKbps=3072",
  },
  {
    label: "slow3g",
    args: "--throttling-method=devtools  --throttling.rttMs=400 --throttling.downloadThroughputKbps=400 --throttling.uploadThroughputKbps=400",
  },
  {
    label: "1/2CPU",
    args: "--throttling-method=devtools --throttling.cpuSlowdownMultiplier=2",
  },
  {
    label: "1/4CPU",
    args: "--throttling-method=devtools --throttling.cpuSlowdownMultiplier=4",
  },
];

for (const net of networks) {
  for (const page of urls) {
    for (let i = 1; i <= 10; i++) {
      console.log(
        `Running Lighthouse for ${page.label} on ${net.label} (${i}/10)`
      );

      const tmpFile = path.join(resultsDir, "tmp.json");
      execSync(
        `lighthouse ${page.url} ${net.args} --preset=desktop --output=json --output-path=${tmpFile}`,
        { stdio: "inherit" }
      );

      const data = JSON.parse(fs.readFileSync(tmpFile, "utf-8"));

      const audits = data.audits;
      const ttfb = audits["server-response-time"]?.numericValue ?? "";
      const fcp = audits["first-contentful-paint"]?.numericValue ?? "";
      const lcp = audits["largest-contentful-paint"]?.numericValue ?? "";
      const cls = audits["cumulative-layout-shift"]?.numericValue ?? "";
      const tti = audits["interactive"]?.numericValue ?? "";

      function formatNumber(value) {
        return typeof value === "number"
          ? value.toString().replace(".", ",")
          : value;
      }

      fs.appendFileSync(
        csvFile,
        [
          page.label,
          net.label,
          i,
          formatNumber(ttfb),
          formatNumber(fcp),
          formatNumber(lcp),
          formatNumber(cls),
          formatNumber(tti),
        ].join(";") + "\n"
      );
    }
  }
}

console.log(`All results written to ${csvFile}`);
