import { registerCalls } from "./features/calls/register";

declare const self: ServiceWorkerGlobalScope;

self.addEventListener("install", (event) => {
	console.log("Installed");
});

self.addEventListener("activate", (event) => {
	console.log("Activated");
});

const signalsChannel = new BroadcastChannel("signals");

registerCalls();