import globalCss from "@/styles/global.css"
import { Component, defineComponent } from "master-ts/library/component"
import { css, html } from "master-ts/library/template"
import { PostPage } from "./libs/postTimeline"
import { Navigation } from "./navigation"
import { route } from "./route"
import { routerLayout } from "./router"

const appCssSheet = new CSSStyleSheet()
appCssSheet.replace(globalCss)
Component.$globalCSS = [appCssSheet]

const AppComponent = defineComponent("x-app")
function App() {
	const component = new AppComponent()

	component.$html = html`
		<header>${Navigation()}</header>
		<main>
			<div class="top">${() => routerLayout.ref.top}</div>
			<div class="bottom">
				<div class="page">${() => routerLayout.ref.page}</div>
				${() => (route.postId.ref ? html`<div class="post">${PostPage(route.postId.ref)}</div>` : null)}
			</div>
		</main>
	`

	return component
}

AppComponent.$css = css`
	:host {
		display: grid;
		padding-top: var(--span);
	}

	header {
		position: fixed;
		bottom: var(--span);
		width: 100%;
		z-index: 10;

		display: grid;
		justify-content: center;
		align-items: center;

		pointer-events: none;
		& > * {
			pointer-events: all;
		}
	}

	main {
		display: grid;
		gap: var(--span);
		padding: 0 var(--span);

		& > .top:empty {
			display: none;
		}

		& > .bottom {
			position: relative;
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
			gap: var(--span);

			& > * {
				overflow: auto;
				padding-bottom: 10vh;

				&.post {
					position: sticky;
					top: 0;
					height: calc(100vh);
				}
			}
		}
	}
`

document.querySelector("#app")!.replaceWith(App())
