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
