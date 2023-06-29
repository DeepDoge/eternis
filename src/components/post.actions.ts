import { wallet } from "@/api/wallet"
import { CommentSvg } from "@/assets/svgs/comment"
import { RepostSvg } from "@/assets/svgs/repost"
import { routeHash } from "@/router"
import type { PostData } from "@/utils/post"
import { PostContent } from "@/utils/post-content"
import { PostId } from "@/utils/post-id"
import { $ } from "master-ts/library/$"
import { defineComponent } from "master-ts/library/component"
import { css, html } from "master-ts/library/template"

const PostActionsComponent = defineComponent("x-post-actions")

export type PostAction = {
	svg: SVGElement
	label: string
	text: string | null
	colorStyle: string
	action: Function | string
}

export function PostActions(post: PostData) {
	const component = new PostActionsComponent()

	async function repost() {
		const bytes = PostContent.encode([
			{
				type: "echo",
				value: PostId.toUint8Array(post.id),
			},
		])
		await wallet.browserWallet.ref?.contracts.EternisPostDB.post(bytes)
	}

	const postActions = [
		{
			svg: CommentSvg(),
			label: "Reply",
			text: post.replyCount ? post.replyCount.toString() : null,
			colorHsl: "var(--primary--hsl)",
			action: routeHash({ postId: post.id }),
		},
		{
			svg: RepostSvg(),
			label: "Repost",
			text: null,
			colorHsl: "var(--second--hsl)",
			action: repost,
		},
	]

	component.$html = html`
		${$.each(postActions).as((postAction) => {
			if (typeof postAction.action === "string")
				return html`
					<a class="ghost" href=${postAction.action} title=${postAction.label} style:--glass-color--hsl=${postAction.colorHsl}>
						<x ${postAction.svg} class="btn-glass" aria-label=${postAction.label}></x>
						${postAction.text}
					</a>
				`
			else
				return html`
					<button class="ghost" on:click=${postAction.action} title=${postAction.label} style:--glass-color--hsl=${postAction.colorHsl}>
						<x ${postAction.svg} class="btn-glass" aria-label=${postAction.label}></x>
						${postAction.text}
					</button>
				`
		})}
	`

	return component
}

PostActionsComponent.$css = css`
	:host {
		display: grid;
		grid-auto-flow: column;
		gap: calc(var(--span) * 1);
		align-items: center;
	}

	:host > * {
		display: grid;
		grid-template-columns: 2.25em auto;
		gap: calc(var(--span) * 0.5);
		align-items: center;

		& > svg {
			border-radius: var(--radius-fab);
		}
	}
`