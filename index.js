const ws = new WebSocket('ws://localhost:3000');

function createSliderGroup(id) {
	let fsElm = document.createElement('fieldset'),
		legendElm = document.createElement('legend'),
		
		syncCheckbox	 	 = document.createElement('input'),

		slider1LabelElm  = document.createElement('label'),
		slider1Elm		 	 = document.createElement('input'),
		slider1ValueElm  = document.createElement('span'),

		slider2LabelElm  = document.createElement('label'),
		slider2Elm       = document.createElement('input'),
		slider2ValueElm  = document.createElement('span');

		syncCheckbox.type = 'checkbox';
		syncCheckbox.checked = true;
		legendElm.appendChild(syncCheckbox);
		legendElm.append(document.createTextNode('Linked'));

	  fsElm.classList.add('ir-group');
		fsElm.appendChild(legendElm);

		fsElm.appendChild(slider1LabelElm);
		slider1LabelElm.textContent = 'Slider 1:'
		slider1Elm.type = 'range';
		slider1Elm.id = `slider_${id}_1`;
		slider1Elm.setAttribute('name', slider1Elm.id);
		slider1Elm.setAttribute('min', 0);
		slider1Elm.setAttribute('max', 4096);
		slider1Elm.value = 0;
		slider1LabelElm.appendChild(slider1Elm);
		slider1LabelElm.appendChild(slider1ValueElm);
	  slider1ValueElm.id = `value_${id}_1`;
		slider1ValueElm.textContent = 0;
		slider1LabelElm.setAttribute('for', slider1Elm.id);
		slider1Elm.addEventListener('input', (e) => {
			slider1ValueElm.textContent = slider1Elm.value;
		});

		fsElm.appendChild(slider2LabelElm);
		slider2Elm.type = 'range';
		slider2Elm.id = `slider_${id}_2`;
		slider2Elm.setAttribute('name', slider2Elm.id);
		slider2Elm.setAttribute('min', 0);
		slider2Elm.setAttribute('max', 4096);
		slider2Elm.value = 0;
		slider2LabelElm.textContent = 'Slider 2:';
		slider2LabelElm.appendChild(slider2Elm);
		slider2LabelElm.appendChild(slider2ValueElm);
	  slider2ValueElm.id = `value_${id}_2`;
		slider2ValueElm.textContent = '0';
		slider2LabelElm.setAttribute('for', slider2Elm.id);
		slider2Elm.addEventListener('input', (e) => {
			slider2ValueElm.textContent = slider2Elm.value;
		});
	
		return fsElm;
}

function createSliderGroup2(id) {
  const clone = document.body.querySelector('#slider-pair').content.cloneNode(true);
	let legendElm = clone.querySelector('fieldset > legend > input[type=checkbox]'),
		labelElms = clone.querySelectorAll('fieldset > label'),
		slider1Elm = labelElms[0].querySelector('input'),
		slider1ValueElm = labelElms[0].querySelector('span'),
		slider2Elm = labelElms[1].querySelector('input'),
		slider2ValueElm = labelElms[1].querySelector('span');

	slider1Elm.id = `slider_${id}_1`;
	labelElms[0].setAttribute('for', slider1Elm.id);
	slider1Elm.setAttribute('name', slider1Elm.id);
	slider1ValueElm.id = `value_${id}_1`;
	slider1Elm.addEventListener('input', (e) => {
		slider1ValueElm.textContent = slider1Elm.value;
	});

	slider2Elm.id = `slider_${id}_2`;
	labelElms[1].setAttribute('for', slider2Elm.id);
	slider2Elm.setAttribute('name', slider2Elm.id);
	slider2ValueElm.id = `value_${id}_2`;
	slider2Elm.addEventListener('input', (e) => {
		slider2ValueElm.textContent = slider2Elm.value;
	});
  return clone;
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

document.body.querySelector('form#myForm').appendChild(createSliderGroup2('g1'));

// document.getElementById('sync1').addEventListener('change', () => syncSliders('slider1', 'slider2', 'sync1'));
// document.getElementById('sync3').addEventListener('change', () => syncSliders('slider3', 'slider4', 'sync3'));
// document.getElementById('sync5').addEventListener('change', () => syncSliders('slider5', 'slider6', 'sync5'));

// document.getElementById('slider1').addEventListener('input', () => updateSliderValue('slider1', 'slider1Value'));
// document.getElementById('slider2').addEventListener('input', () => updateSliderValue('slider2', 'slider2Value'));
// document.getElementById('slider3').addEventListener('input', () => updateSliderValue('slider3', 'slider3Value'));
// document.getElementById('slider4').addEventListener('input', () => updateSliderValue('slider4', 'slider4Value'));
// document.getElementById('slider5').addEventListener('input', () => updateSliderValue('slider5', 'slider5Value'));
// document.getElementById('slider6').addEventListener('input', () => updateSliderValue('slider6', 'slider6Value'));

// document.getElementById('sendToServer').addEventListener('change', sendData);
