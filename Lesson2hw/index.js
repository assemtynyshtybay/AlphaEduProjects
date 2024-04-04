import fs from "fs"; // const fs = require("fs");

import http from "http"; //const http = require("http"); //for work with http protocol
import url, { fileURLToPath } from "url"; //const url = require("url");

import replaceTemplate from "./modules/replaceTemplate.js";
import { dirname } from "path";
import replaceTemp from "./modules/replaceTemp.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview-temp.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/product-card.html`,
  "utf-8"
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product-temp.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const apiData = JSON.parse(data);
const questions = JSON.parse(fs.readFileSync(`${__dirname}/data/faq.json`));

const accordionOverview = fs.readFileSync(
  `${__dirname}/template/accordion.html`,
  "utf-8"
);
const accordionCard = fs.readFileSync(
  `${__dirname}/template/question-temp.html`,
  "utf-8"
);

const questionCard = fs.readFileSync(
  `${__dirname}/template/question-details.html`,
  "utf-8"
);
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  //overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "content-type": "text/html",
    });
    const cardsHtml = questions
      .map((el) => replaceTemp(accordionCard, el))
      .join("");
    let overviewContent = accordionOverview.replace(
      `{%ACCORDION_CARDS%}`,
      cardsHtml
    );
    res.end(overviewContent);

    //product page
  } else if (pathname === "/question") {
    res.writeHead(200, {
      // info for web
      "content-type": "text/html",
    });
    const question = questions[query.id - 1]; //question[0]...
    const cardHTML = replaceTemp(questionCard, question);
    res.end(cardHTML);
    //API
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(data);
  } else {
    // Headers should be sent before
    res.writeHead(404, {
      Content: "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page cannot be found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening to request on port 8000");
});
