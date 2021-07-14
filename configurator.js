#!/usr/bin/env node
const commander = require("commander");
const TOML = require("@iarna/toml");
const fs = require("fs");
const program = new commander.Command();
const { prompt } = require("enquirer");

// DECALRE ACCEPTED CLI ARGS
program
  // .option("-d, --debug", "output extra debugging")
  // .option("-s, --small", "small pizza size")
  .option("-c, --config", "launch configurator");

async function updateConfig(response) {
  let currentConfig = new Object();
  try {
    currentConfig = TOML.parse(fs.readFileSync("./config.toml", "utf-8"));
  } catch (err) {
    console.error(
      "Parsing error on line" +
        err.line +
        ", column" +
        err.column +
        ": " +
        err.message
    );
  }

  // Apply Changes to Current Config
  currentConfig.ticker.coins = response.coins;
  currentConfig.ticker.vsCurrency = response.vsCurrency;
  currentConfig.ticker.refreshRate = response.refreshRate;

  // Save Changes to config.toml
  let newConfig = TOML.stringify(currentConfig);
  fs.writeFile("config.toml", newConfig, err => {
    if (err) return console.log(err);
    console.log("Config Saved!");
  });
}

// QUESTIONS ASKED BY CONFIFURATOR
const tickerPrompts = [
  {
    type: "list",
    name: "coins",
    message: "Coins? (comma separated IDs)",
  },
  {
    type: "Input",
    name: "vsCurrency",
    message: "Currency?",
  },
  {
    type: "Numeral",
    name: "refreshRate",
    message: "Refresh rate? (> 15)",
  },
];

// PARSE ARGS FROM CLI
program.parse(process.argv);
const options = program.opts();

// Set actions for each ARG
if (options.config) configurator();

async function configurator() {
  try {
    const response = await prompt(tickerPrompts);
    updateConfig(response);
  } catch (err) {
    console.log(err);
  }
}
