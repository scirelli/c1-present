const ws = new WebSocket('ws://localhost:3000');

if(!String.prototype.mustache) {
  String.prototype.mustache = function(o) {
    return this.replace(/{{([^{}]*)}}/g, function(a, b) {
      var r = o[b];
      return typeof r === 'string' || typeof r === 'number' ? r:a;
    });
  };
}

function createSlider(index) {
  const clone = document.body.querySelector('#slider-template').content.cloneNode(true);
	let sliderElm    = clone.querySelector('.slider'),
		sliderLabelElm = sliderElm.querySelector('label'),
		sliderInputElm = sliderElm.querySelector('input'),
		sliderSpanElm  = sliderElm.querySelector('.display-range-value');

	sliderInputElm.id = `slider_${index}`;
	sliderLabelElm.setAttribute('for', sliderInputElm.id);
	sliderLabelElm.textContent = sliderLabelElm.textContent.mustache({index});
	sliderInputElm.setAttribute('name', sliderInputElm.id);
	sliderSpanElm.id = `value_${index}`;
	sliderInputElm.addEventListener('input', () => {
		sliderSpanElm.textContent = sliderInputElm.value;
		//sendData();
	});

	return clone;
}

function createSliderGroup(index) {
  const clone = document.body.querySelector('#slider-pair-template').content.cloneNode(true);
	let checkboxElm = clone.querySelector('fieldset > legend > input[type=checkbox]'),
		slider1TmplElm = createSlider(index++),
		slider1Elm = slider1TmplElm.querySelector('.slider'),
		slider1InputElm = slider1Elm.querySelector('input'),
		slider2TmplElm = createSlider(index),
		slider2Elm = slider2TmplElm.querySelector('.slider'),
		slider2InputElm = slider2Elm.querySelector('input');

	clone.querySelector('fieldset').appendChild(slider1TmplElm);
	clone.querySelector('fieldset').appendChild(slider2TmplElm);

	checkboxElm.addEventListener('change', () => {
		if(!checkboxElm.checked) return;
		slider2InputElm.value = slider1InputElm.value;
		slider2Elm.querySelector('.display-range-value').textContent = slider1InputElm.value;
	});

	slider1InputElm.addEventListener('input', (e) => {
		if(!checkboxElm.checked) return;
		slider2InputElm.value = slider1InputElm.value;
		slider2Elm.querySelector('.display-range-value').textContent = slider1InputElm.value;
	});

	slider2InputElm.addEventListener('input', (e) => {
		if(!checkboxElm.checked) return;
		slider1InputElm.value = slider2InputElm.value;
		slider1Elm.querySelector('.display-range-value').textContent = slider2InputElm.value;
	});

  return clone;
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

document.body.querySelector('form#myForm').appendChild(createSliderGroup(1));

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
