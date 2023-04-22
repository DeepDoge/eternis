import type { Address } from "@/utils/address"
import { defineComponent } from "master-ts/library/component"
import { css, html } from "master-ts/library/template"
import { WalletAddress } from "./wallet-address"

const ProfileComponent = defineComponent("x-profile")
export function Profile(address: Address) {
	const component = new ProfileComponent()

	component.$html = html`
		<div class="avatar"></div>
		<div class="name">Nameless</div>
		<div class="address">${WalletAddress(address)}</div>
	`

	return component
}

ProfileComponent.$css = css`
	.avatar {
		grid-area: avatar;
	}
	.name {
		grid-area: name;
	}
	.address {
		grid-area: address;
	}

	:host {
		display: grid;
		grid-template-areas:
			"avatar . name"
			"avatar . ."
			"avatar . address"
			"avatar . . ";
		grid-template-columns: 2.5em calc(var(--span) * 0.5) auto;
		grid-template-rows: auto auto auto auto;
		place-content: start;
	}

	.avatar {
		aspect-ratio: 1;
		width: 100%;
		background-color: hsl(var(--slave-hsl));
		border-radius: var(--radius-fab);
	}
`