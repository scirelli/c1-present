const ws = new WebSocket('ws://localhost:3000');

function createSliderGroup() {
	let fsElm = document.createElement('fieldset'),
		legendElm = document.createElement('legend'),

		slider1LabelElm = document.createElement('label'),
		slider1Elm = document.createElement('input'),
		slider1ValueElem = document.createElement('span'),

		slider2LabelElm = document.createElement('label'),
		slider2Elm = document.createElement('input'),
		slider2ValueElem = document.createElement('span');

	  fsElm.classList.add('ir-group');
}

function updateSliderValue(sliderId, valueId) {
	const slider = document.getElementById(sliderId);
	const valueSpan = document.getElementById(valueId);
	valueSpan.textContent = slider.value;
	sendData();
}

function syncSliders(slider1Id, slider2Id, checkboxId) {
	const slider1 = document.getElementById(slider1Id);
	const slider2 = document.getElementById(slider2Id);
	const checkbox = document.getElementById(checkboxId);

	function updateSyncedSlider(event) {
		if (checkbox.checked) {
			if (event.target.id === slider1Id) {
				slider2.value = slider1.value;
				updateSliderValue(slider2Id, slider2Id + 'Value');
			} else {
				slider1.value = slider2.value;
				updateSliderValue(slider1Id, slider1Id + 'Value');
			}
		}
	}

	slider1.addEventListener('input', updateSyncedSlider);
	slider2.addEventListener('input', updateSyncedSlider);
}

function sendData() {
	const sendCheckbox = document.getElementById('sendToServer');
	if (sendCheckbox.checked) {
		const form = document.getElementById('myForm');
		const formData = new FormData(form);
		const data = {};
		formData.forEach((value, key) => {
			if (key !== "sendToServer"){
				data[key] = value;
			}
		});
		ws.send(JSON.stringify(data));
	}
}

document.getElementById('sync1').addEventListener('change', () => syncSliders('slider1', 'slider2', 'sync1'));
document.getElementById('sync3').addEventListener('change', () => syncSliders('slider3', 'slider4', 'sync3'));
document.getElementById('sync5').addEventListener('change', () => syncSliders('slider5', 'slider6', 'sync5'));

document.getElementById('slider1').addEventListener('input', () => updateSliderValue('slider1', 'slider1Value'));
document.getElementById('slider2').addEventListener('input', () => updateSliderValue('slider2', 'slider2Value'));
document.getElementById('slider3').addEventListener('input', () => updateSliderValue('slider3', 'slider3Value'));
document.getElementById('slider4').addEventListener('input', () => updateSliderValue('slider4', 'slider4Value'));
document.getElementById('slider5').addEventListener('input', () => updateSliderValue('slider5', 'slider5Value'));
document.getElementById('slider6').addEventListener('input', () => updateSliderValue('slider6', 'slider6Value'));

document.getElementById('sendToServer').addEventListener('change', sendData);
