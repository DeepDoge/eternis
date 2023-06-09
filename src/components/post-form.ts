import { PaperPlaneSvg } from "@/assets/svgs/paper-plane"
import { ProfileAvatarUI } from "@/components/profile-avatar"
import { ProfileNameUI } from "@/components/profile-name"
import { requireWallet } from "@/components/wallet"
import { route } from "@/router"
import { PostContent } from "@/utils/post-content"
import { PostId } from "@/utils/post-id"
import { Wallet } from "@/utils/wallet"
import { ethers } from "ethers"
import { $ } from "master-ts/library/$"
import { defineComponent } from "master-ts/library/component"
import type { SignalReadable } from "master-ts/library/signal"
import { css, html } from "master-ts/library/template"

const PostFormComponent = defineComponent("x-post-form")
export function PostFormUI(parentId: SignalReadable<PostId | null>) {
	const component = new PostFormComponent()

	const state = $.writable<"loading" | "idle" | Error>("idle")
	const loading = $.derive(() => state.ref === "loading")

	const text = $.writable("")
	const postContents = $.derive<PostContent[]>(() => [
		{ type: "text", value: ethers.toUtf8Bytes(text.ref.trim()) },
		...(parentId.ref ? [{ type: "parent", value: ethers.toBeArray(PostId.toHex(parentId.ref)) }] : []),
	])
	const bytes = $.derive(() => PostContent.encode(postContents.ref))

	async function sendPost() {
		try {
			state.ref = "loading"
			if (!Wallet.browserWallet.ref) throw new Error(Wallet.browserWalletState.ref)
			await Wallet.browserWallet.ref.contracts.EternisPostDB.post(bytes.ref)
		} catch (error) {
			if (error instanceof Error) state.ref = error
			else state.ref = new Error(`${error}`)
			console.error(error)
		} finally {
			state.ref = "idle"
		}
	}

	function resizeTextArea() {
		const textarea = component.$shadowRoot.querySelector<HTMLTextAreaElement>(".fields textarea")
		if (!textarea) return
		const placeholder = document.createElement("div")
		placeholder.style.height = `${textarea.scrollHeight}px`
		textarea.after(placeholder)
		textarea.style.height = "0"
		textarea.style.height = `${textarea.scrollHeight}px`
		placeholder.remove()
	}
	$.effect$(component, resizeTextArea, [route.postId])
	$.onMount$(component, () => {
		setTimeout(resizeTextArea)
		window.addEventListener("resize", resizeTextArea)
		return () => window.removeEventListener("resize", resizeTextArea)
	})

	component.$html = html`
		${requireWallet((wallet) => {
			const profileAddress = $.derive(() => wallet.ref.address)

			return html`
				<form on:submit=${(e) => (e.preventDefault(), sendPost())} class:loading=${loading}>
					<x ${ProfileAvatarUI(profileAddress)} class="profile-avatar"></x>
					<x ${ProfileNameUI(profileAddress)} class="profile-name"></x>
					<div class="fields">
						<textarea
							required
							placeholder=${() => (parentId.ref ? "Reply..." : "Say something...")}
							bind:value=${text}
							on:input=${resizeTextArea}></textarea>
					</div>
					<div class="actions">
						<button class="btn">Post${PaperPlaneSvg()}</button>
					</div>
					<div class="byte-size">${() => bytes.ref.byteLength} bytes</div>
				</form>
			`
		})}
	`

	return component
}

PostFormComponent.$css = css`
	:host {
		display: grid;
	}

	form {
		display: grid;
		grid-template-areas:
			"avatar		.		name		name"
			"avatar		.		.			."
			"avatar		.		fields 		fields"
			". 			.		size		size"
			". 			.		actions		actions";
		grid-template-columns: 2.25em calc(var(--span) * 0.5) 1fr auto;
		grid-template-rows: auto calc(var(--span) * 0.25);
		place-content: start;

		background-color: hsl(var(--base--hsl));
		color: hsl(var(--base-text--hsl));
		border-radius: var(--radius-rounded);
		padding: var(--span);

		& > * {
			display: grid;
		}
		& > .profile-avatar {
			grid-area: avatar;
		}
		& > .profile-name {
			grid-area: name;
			font-size: 0.85em;
		}
		& > .fields {
			grid-area: fields;

			& textarea {
				font-size: 1.25em;
				--height: 3em;
				height: var(--height);
				min-height: var(--height);
				resize: none;
				background-color: transparent;
				border: none;
				color: inherit;

				&:focus-visible {
					outline: none;
				}

				&::placeholder {
					color: currentColor;
					opacity: 0.6;
				}
			}
		}
		& > .actions {
			grid-area: actions;
			justify-content: end;

			position: relative;
			padding-top: calc(var(--span) * 0.5);

			&::before {
				content: "";
				position: absolute;
				inset: 0;
				bottom: unset;
				height: 1px;
				background-color: currentColor;
				opacity: 0.05;
			}
			& button {
				border-radius: var(--radius-rounded);
				background-color: hsl(var(--primary--hsl));
				color: hsl(var(--primary-text--hsl));

				display: grid;
				grid-template-columns: auto 1.1em;
				align-items: center;
				gap: calc(var(--span) * 0.5);
			}
		}
		& > .byte-size {
			grid-area: size;
			font-size: 0.65em;
			opacity: 0.65;
		}

		&:not(:focus-within):has(textarea:invalid) {
			& > .actions,
			& > .byte-size {
				display: none;
			}
			& textarea {
				height: 3ch !important;
				min-height: unset !important;
			}
		}
	}

	.loading {
		opacity: 0.75;
		pointer-events: none;
		user-select: none;
		& > * {
			cursor: progress;
		}
	}
`
