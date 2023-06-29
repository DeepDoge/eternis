import { networkConfigs } from "@/api/network-config"
import { Profile } from "@/components/profile"
import { ProfileName } from "@/components/profile-name"
import { route, routeHash } from "@/router"
import { Address } from "@/utils/address"
import type { PostData } from "@/utils/post"
import { PostId } from "@/utils/post-id"
import { relativeTimeSignal } from "@/utils/time"
import { ethers } from "ethers"
import { $ } from "master-ts/library/$"
import { defineComponent } from "master-ts/library/component"
import type { SignalReadable } from "master-ts/library/signal"
import { css, html } from "master-ts/library/template"
import { PostFromId } from "./post-from-id"
import { PostActions } from "./post.actions"
import { Repost } from "./repost"

const PostComponent = defineComponent("x-post")
export function Post(post: SignalReadable<PostData>) {
	const component = new PostComponent()

	const postContents = $.derive(() => post.ref.contents)

	const echoOnly = $.derive(() => (postContents.ref.length === 1 && postContents.ref[0]!.type === "echo" ? postContents.ref[0]!.value : null))

	const postHref = $.derive(() => routeHash({ postId: post.ref.id }))
	const parentHref = $.derive(() => routeHash({ postId: post.ref.parentId }))

	component.$html = html`
		${$.match(echoOnly)
			.case(
				null,
				() => html`
					<div class="post" class:active=${() => route.postId.ref === post.ref.id}>
						<a href=${postHref} aria-label="Go to the ${() => post.ref.id}" class="backdrop-link"></a>
						<div class="header">
							<x ${Profile($.derive(() => post.ref.author))} class="author"></x>
							<div class="chips">
								<span class="chain" title=${() => networkConfigs.chains[post.ref.chainKey].name}>
									${() => networkConfigs.chains[post.ref.chainKey].name}
								</span>
								<a class="id post-id" href=${postHref}> ${() => post.ref.id.slice(post.ref.id.length - 5)} </a>
								${$.match($.derive(() => post.ref.parentId))
									.case(null, () => null)
									.default(
										(parentId) =>
											html`<a class="id parent-id" href=${parentHref}> ${() => parentId.ref.slice(parentId.ref.length - 5)} </a>`
									)}
							</div>
						</div>
						<div class="content">
							${$.each(postContents).as((content) =>
								$.match($.derive(() => content.ref.type))
									// Using async to catch errors
									.case("text", () => html`<span>${$.await($.derive(async () => ethers.toUtf8String(content.ref.value)))}</span>`)
									.case("@", () =>
										$.await($.derive(async () => Address.from(ethers.toUtf8String(content.ref.value)))).then((address) =>
											ProfileName(address)
										)
									)
									.case("echo", () =>
										$.await($.derive(async () => PostId.fromUint8Array(content.ref.value))).then((postId) =>
											$.match(postId)
												.case(post.ref.id, () => null)
												.default((postId) => PostFromId(postId))
										)
									)
									.default(() => null)
							)}
						</div>
						<div class="footer">
							${() => PostActions(post.ref)}
							<a class="created-at" href=${postHref}>${() => relativeTimeSignal(post.ref.createdAt)}</a>
						</div>
					</div>
				`
			)
			.default((echo) => Repost($.derive(() => ({ postId: PostId.fromUint8Array(echo.ref), authorAddress: post.ref.author }))))}
	`

	return component
}

PostComponent.$css = css`
	:host {
		display: contents;
		font-size: 1rem;
	}

	.post {
		position: relative;
		width: 100%;

		display: grid;
		gap: calc(var(--span) * 0.5);
		padding: calc(var(--span) * 0.75) calc(var(--span) * 0.75);

		background-color: hsl(var(--base--hsl), 0.5);
		color: hsl(var(--base--text-hsl));

		border-radius: var(--radius);
		border: calc(var(--span) * 0.1) solid transparent;

		&.active {
			border-color: hsl(var(--second--hsl));
		}

		isolation: isolate;
		& > :not(.backdrop-link) {
			pointer-events: none;
			& > * {
				pointer-events: all;
			}
		}
		& > .backdrop-link {
			position: absolute;
			inset: 0;
			z-index: -1;
		}
	}

	.header {
		display: grid;
		grid-auto-flow: column;
		gap: calc(var(--span) * 0.5);
		align-items: center;
		justify-content: space-between;
		font-size: 0.75em;
	}

	.author {
		font-size: 0.95em;
	}

	.content {
		font-size: 1.1em;

		display: flex;
		gap: 0.5ch;
		flex-wrap: wrap;
		align-items: center;
		justify-content: start;
	}

	.footer {
		display: flex;
		flex-wrap: wrap;
		gap: calc(var(--span) * 0.5);
		font-size: 0.75em;

		align-items: center;
		justify-content: space-between;
	}

	.chips {
		display: grid;
		grid-auto-flow: column;
		align-items: center;
		gap: 0.5em;

		& > a {
			padding: calc(var(--span) * 0) calc(var(--span) * 0.5);

			&::before {
				content: "@";
			}
		}
		& > * {
			display: block;
			border-radius: var(--radius);

			&.chain {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			&.post-id {
				color: hsl(var(--second--text-hsl));
				background-color: hsl(var(--second--hsl), 75%);
			}
			&.parent-id {
				color: hsl(var(--accent--text-hsl));
				background-color: hsl(var(--accent--hsl), 75%);
			}
		}
	}
`
