import { PostTimeline } from "@/libs/post-timeline"
import { Navigation } from "@/navigation"
import { route } from "@/router"
import { routerLayout } from "@/routes"
import globalCss from "@/styles/global.css?inline"
import { $ } from "master-ts/library/$"
import { Component, defineComponent } from "master-ts/library/component"
import { css, html } from "master-ts/library/template"

const globalCssSheet = new CSSStyleSheet()
globalCssSheet.replace(globalCss)
Component.$globalCSS = [globalCssSheet]
;(document.adoptedStyleSheets ??= []).push(globalCssSheet)

const AppComponent = defineComponent("x-app")
function App() {
	const component = new AppComponent()

	component.$html = html`
		<header>${Navigation()}</header>
		<main>
			${$.match($.derive(() => routerLayout.ref.top))
				.case(null, () => null)
				.default((layoutTop) => html`<div class="top">${layoutTop}</div>`)}
			<div class="bottom">
				<div class="page">${() => routerLayout.ref.page}</div>
				${$.match(route.postId)
					.case(null, () => null)
					.default((postId) => html` <div class="post">${PostTimeline(postId)}</div>`)}
			</div>
		</main>
	`

	return component
}

AppComponent.$css = css`
	:host {
		display: grid;
	}

	header {
		position: fixed;
		bottom: 0;
		width: 100%;
		z-index: 10;

		display: grid;
		align-items: center;

		pointer-events: none;
		& > * {
			pointer-events: all;
		}
	}

	main {
		display: grid;
		/* Using paddings and not gaps, because of the glow effects */
		& .top,
		& .bottom > * {
			padding-top: var(--span);
			padding-inline: calc(var(--span));
		}

		& > .bottom {
			position: relative;
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(0, 1fr));

			& > * {
				overflow: auto;
				padding-bottom: 10vh;
			}
			& > .post {
				position: sticky;
				top: 0;
				height: calc(100vh);
			}
		}
	}

	@media (max-width: 1023px) {
		:host {
			font-size: 0.8em;
		}

		main > .bottom:has(.post) {
			& > .page {
				position: fixed;
				left: -200%;
			}

			& > .post {
				position: static;
				height: auto;
			}
		}
	}
`

document.querySelector("#app")?.replaceWith(App())
