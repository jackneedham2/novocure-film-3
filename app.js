const main = document.querySelector('main');

window.addEventListener('load', async e => {
	if('serviceWorker' in navigator) {
		try {
			navigator.serviceWorker.register('sw.js');
			console.log("SW Register");
		} catch(error) {
			console.log("Reg failed")
		}
	}

});