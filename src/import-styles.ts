import globalCss from "@/styles/global.css?inline"
import rootCss from "@/styles/root.css?inline"
import { Component } from "master-ts/library/component"

const globalStyleSheet = new CSSStyleSheet()
const rootStyleSheet = new CSSStyleSheet()

await Promise.all([globalStyleSheet.replace(globalCss), rootStyleSheet.replace(rootCss)])

Component.$globalStyleSheets.push(globalStyleSheet)
document.adoptedStyleSheets.push(rootStyleSheet, globalStyleSheet)
