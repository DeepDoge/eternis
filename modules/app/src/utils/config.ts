import { Config } from "@root/service";
import { ref } from "purify-js";
import { sw } from "~/sw";

export const config = ref(await sw.calls.getConfigs());

Config.configUpdateBroadcastChannel.addEventListener("message", (value) => {
	config.val = value.data;
});
