import { spawnFloatingBox } from "@/components/floating-box"
import { Wallet } from "@/utils/wallet"
import { $ } from "master-ts/library/$"
import { defineComponent } from "master-ts/library/component"
import { css, html } from "master-ts/library/template"
import { ChainButtonUI } from "./chain-button"
import { ChainChangerUI } from "./chain-changer"

const ChainChangerButtonComponent = defineComponent("x-chain-changer-button")
export function ChainChangerButtonUI() {
	const component = new ChainChangerButtonComponent()

	component.$html = html`
		${$.match(Wallet.browserWallet)
			.case(null, () => null)
			.default(
				(wallet) =>
					html`
						<x
							${ChainButtonUI($.derive(() => wallet.ref.chainKey))}
							on:click=${(e: MouseEvent) => (e.preventDefault(), spawnFloatingBox(e, ChainChangerUI()))}></x>
					`
			)}
	`

	return component
}

ChainChangerButtonComponent.$css = css`
	:host {
		display: grid;
		width: 3.5em;
		aspect-ratio: 1;
	}
`
