
const mobileAgents = ["Android", "iPhone", "iPad", "iPod", "Symbian"];
let userAgent = navigator.userAgent;

export const DefaultDiscord = "https://discord.com/invite/UHmUBWZmWU";
export const DefaultTwitter = "https://twitter.com/contri_build";

export const Common = {
	isMobile: mobileAgents.some(ag => userAgent.includes(ag)),


	toWebsite(url?) {
		if (typeof url != "string") url = "";
		open(url || "");
	},
	toDiscord(url?) {
		if (typeof url != "string") url = "https://discord.gg/UHmUBWZmWU";
		open(url || DefaultDiscord);
	},
	toTwitter(url?) {
		if (typeof url != "string") url = "";
		open(url || DefaultTwitter);
	},
	toMedium(url?) {
		if (typeof url != "string") url = "";
		open(url || "");
	},
	toTelegram(url?) {
		if (typeof url != "string") url = "";
		open(url || "");
	},
	toMirror(url?) {
		if (typeof url != "string") url = "https://mirror.xyz/contri.eth";
		open(url || "");
	},
	toDemo() {
		location.href = "/contri/app";
	},
	toApply() {
		location.href = "https://forms.gle/nqsKZApJYNaEkXU3A";
	},
	copyToClipboard(str) {
		const input = document.createElement('input');
		document.body.appendChild(input);
		input.setAttribute('value', str);
		input.select();
		if (document.execCommand('copy')) {
			document.execCommand('copy');
		}
		document.body.removeChild(input);
	}
}
