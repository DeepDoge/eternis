import { $ } from "master-ts/library/$"
import { defineComponent } from "master-ts/library/component"
import { css, html } from "master-ts/library/template"
import { ChartFilledSvg } from "./assets/svgs/chart-filled"
import { ChartOutlineSvg } from "./assets/svgs/chart-outline"
import { HomeFilledSvg } from "./assets/svgs/home-filled"
import { HomeOutlineSvg } from "./assets/svgs/home-outline"
import { SearchSvg } from "./assets/svgs/search"
import { Profile } from "./libs/profile"
import { route } from "./route"
import { Address } from "./utils/address"

const NavigationComponent = defineComponent("x-navigation")
export function Navigation() {
	const component = new NavigationComponent()

	component.$html = html`
		<div class="left">
			<x
				${Profile($.derive(() => Address("0xE272C9a263701DAFFe940FB4ecEACFa9b2c1217D")))}
				class="profile"
				class:active=${() => route.path.ref.startsWith(Address("0xE272C9a263701DAFFe940FB4ecEACFa9b2c1217D"))}></x>
		</div>

		<nav>
			<ul>
				<li>
					<a href="#" class:active=${() => route.path.ref === ""} aria-label="home" title="Home">
						${$.match(route.path)
							.case("", () => html`<x ${HomeFilledSvg()} class="icon"></x>`)
							.default(() => html`<x ${HomeOutlineSvg()} class="icon"></x>`)}
					</a>
				</li>
				<li>
					<a href="#search" class:active=${() => route.path.ref === "search"} aria-label="search" title="Search">
						<x ${SearchSvg()} class="icon"></x>
					</a>
				</li>
				<li>
					<a href="#top" class:active=${() => route.path.ref === "top"} aria-label="top posts" title="Top Posts">
						${$.match(route.path)
							.case("top", () => html`<x ${ChartFilledSvg()} class="icon"></x>`)
							.default(() => html`<x ${ChartOutlineSvg()} class="icon"></x>`)}
					</a>
				</li>
			</ul>
		</nav>

		<div class="right">Other</div>
	`

	return component
}

NavigationComponent.$css = css`
	:host {
		display: grid;
		justify-content: space-between;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		padding-inline: calc(var(--span) * 0.65);
		padding-bottom: calc(var(--span) * 0.5);
		gap: var(--span);

		background: linear-gradient(to top, hsl(var(--master-hsl), 15%), transparent);
	}

	.profile {
		font-size: 0.85em;
	}

	.left {
		display: grid;
		justify-content: start;
		align-items: center;
	}

	.right {
		display: grid;
		justify-content: end;
		align-items: center;
	}

	ul {
		list-style: none;

		display: grid;
		grid-auto-flow: column;
		align-items: center;
		padding: 0;

		& > li {
			display: grid;
			grid-auto-flow: column;
			align-items: center;
		}

		& .icon {
			height: min(1.5em, 5vh);
			color: hsl(var(--base-text-hsl));
		}
	}

	ul a,
	.profile {
		padding: calc(var(--span) * 0.5) calc(var(--span) * 1);
		border-radius: var(--radius);

		&.active {
			background-color: hsl(var(--master-text-hsl), 15%);
		}
	}
`
