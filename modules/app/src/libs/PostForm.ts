import { globalSheet } from "@/styles";
import { config } from "@/utils/config";
import { Post, encodePost } from "@/utils/post";
import { uniqueId } from "@/utils/unique";
import { getSigner } from "@/utils/wallet";
import { IEternisProxy } from "@modules/service/contracts";
import { zeroPadBytes } from "ethers";
import { computed, css, fragment, ref, sheet, tags } from "purify-js";

const { form, div, textarea, button, small, input } = tags;

export function PostForm() {
	const host = div({ role: "form" });
	const shadow = host.element.attachShadow({ mode: "open" });
	shadow.adoptedStyleSheets.push(globalSheet, PostFormStyle);

	const text = ref("");
	const textEncoded = computed(() => encodePost([{ type: Post.Content.TypeMap.Text, value: text.val }]));

	const proxyContracts = computed(() => config.val.networks[0].contracts.EternisProxies);
	const currentProxyKey = ref("");
	const currentProxy = computed(() => proxyContracts.val[currentProxyKey.val]);

	const postForm = form()
		.id(uniqueId("post-form"))
		.hidden(true)
		.onsubmit(async (event) => {
			event.preventDefault();

			const address = currentProxy.val;
			if (!address) return;

			const signer = await getSigner();
			const proxyContract = IEternisProxy.connect(signer, address);

			const tx = await proxyContract.post(
				config.val.networks[0].contracts.EternisIndexer,
				[zeroPadBytes(signer.address, 32)],
				textEncoded.val,
			);
		}).element;

	shadow.append(
		fragment(
			postForm,
			div({ class: "fields" }).children(
				div({ class: "field" }).children(
					textarea({ form: postForm.id, class: "input" })
						.name("content")
						.required(true)
						.ariaLabel("Post content")
						.placeholder("Just say it...")
						.value(text)
						.oninput((event) => {
							const textarea = event.currentTarget;
							textarea.style.height = "auto";
							textarea.style.height = `calc(calc(${textarea.scrollHeight}px - 1em))`;
							text.val = textarea.value;
						}),
					small().children(
						computed(() => textEncoded.val.byteLength),
						" bytes",
					),
				),
			),
			div({ class: "actions" }).children(
				button({
					form: postForm.id,
					class: "button",
				})
					.type("submit")
					.disabled(computed(() => !currentProxy.val))
					.children("Post"),
			),
			div({ class: "select-proxy" }).children(
				computed(() =>
					Object.entries(proxyContracts.val).map(([key, address]) =>
						button({ class: "button" })
							.type("button")
							.onclick(() => (currentProxyKey.val = key))
							.children(key),
					),
				),
			),
		),
	);

	return host;
}

const PostFormStyle = sheet(css`
	:host {
		display: grid;
		gap: 1em;
	}

	.fields {
		display: grid;
		gap: 1em;
	}

	.field {
		display: grid;
		gap: 0.25em;

		& small {
			justify-self: end;
		}
	}

	.actions {
		display: grid;
		grid-auto-flow: column;
		justify-content: end;
		gap: 1em;
	}

	textarea {
		resize: none;
		min-height: 2em;
		font-size: 1.25em;
		overflow-x: hidden;
		overflow-wrap: break-word;
	}
`);
