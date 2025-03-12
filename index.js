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

function sendData() {
	const sendCheckbox = document.getElementById('sendToServer');
	if (sendCheckbox.checked) {
		const form = document.getElementById('myForm');
		const formData = new FormData(form);
		const data = {};
		formData.forEach((value, key) => {
			if (key !== 'sendToServer'){
				data[key] = value;
			}
		});
		ws.send(JSON.stringify(data));
	}
}

document.body.querySelector('form#myForm').appendChild(createSliderGroup(1));
document.body.querySelector('form#myForm').appendChild(createSliderGroup(3));
document.body.querySelector('form#myForm').appendChild(createSliderGroup(5));

['overcurrent', 'doorSwitch', 'limitSwitch1', 'limitSwitch2'].forEach(n => {
	document.body.querySelector(`input[name="${n}"]`).addEventListener('change', sendData);
	document.body.querySelector(`button[name="${n}"]`).addEventListener('mousedown', e => {
		e.preventDefault();
		e.stopPropagation();
		setTimeout(()=>{
			const checkbox = document.body.querySelector(`input[name="${n}"]`);
			if(checkbox.checked) checkbox.checked = false;
			document.body.querySelector(`input[name="${n}"]`).click();
		}, 0);
	});
	document.body.querySelector(`button[name="${n}"]`).addEventListener('mouseup', e => {
		e.preventDefault();
		e.stopPropagation();
		setTimeout(()=>{
			const checkbox = document.body.querySelector(`input[name="${n}"]`);
			if(!checkbox.checked) checkbox.checked = true;
			document.body.querySelector(`input[name="${n}"]`).click();
		}, 0);
	});
});
Array.prototype.forEach.call(document.body.querySelectorAll('.slider input[type="range"]'), e => {
	e.addEventListener('input', sendData);
});

const dropArea = document.getElementById('drop-area');
const textArea = document.getElementById('text-area');

dropArea.addEventListener('dragstart', (event) => {
	event.preventDefault();
	event.dataTransfer.dropEffect = "copy";	
});

dropArea.addEventListener('dragover', (event) => {
	event.preventDefault();
	dropArea.classList.add('drag-over');
});

dropArea.addEventListener('dragleave', () => {
	dropArea.classList.remove('drag-over');
});

dropArea.addEventListener('drop', (event) => {
	event.preventDefault();
	dropArea.classList.remove('drag-over');

	const file = event.dataTransfer.files[0];

	if (file) {
		const fileName = file.name.toLowerCase();
		if (fileName.endsWith('.bin')) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const arrayBuffer = e.target.result;
				const uint8Array = new Uint8Array(arrayBuffer);
				textArea.value = uint8Array;
			};
			reader.readAsArrayBuffer(file);
		} else if (fileName.endsWith('.json')) {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const jsonObject = JSON.parse(e.target.result);
					textArea.value = JSON.stringify(jsonObject, null, 2);
				} catch (error) {
					textArea.value = "Error parsing JSON file.";
				}
			};
			reader.readAsText(file);
		} else {
			textArea.value = "Invalid file type. Only .bin and .json files are allowed.";
		}
	}
});
