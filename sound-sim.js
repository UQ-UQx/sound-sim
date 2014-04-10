// Add trim function to String for IE >=8.
if (typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}

// Apply functionality when document ready.
$(function() {
  $("#sound-slider").slider({
    value: 4.30103,
	min: 0.30103,
	max: 8.30103,
	step: 0.00001,
	animate: 'slow',
	slide: function(event, ui) {
	  $('#frequency-input').val(freqAutoRange(Math.pow(10, ui.value)));
	  $('#wavelength-input').val(wavelengthAutoRange(calcWavelength(Math.pow(10, ui.value))));
	}
  });

  $('#wavelength-input').change(function() {
	printWavelengthCalcFreq();
  });

  $('#wavelength-units').change(function() {
	printWavelengthCalcFreq();
  });

  $('#frequency-input').change(function() {
	printFreqCalcWavelength();
  });

  $('#frequency-units').change(function() {
	printFreqCalcWavelength();
  });

  $('#frequency-input').val('20');
  $('#frequency-units').val('1000');
  $('#frequency-input').change();

  function printWavelengthCalcFreq() {
	var wavelengthInput = 0;
	var wlInputStr = $('#wavelength-input').val();

    if ((!isNaN(wlInputStr)) && (wlInputStr.trim() !== '')) {
	  wavelengthInput = parseFloat($('#wavelength-input').val()) * parseFloat($('#wavelength-units').val());
	  if (wavelengthInput < 7.7e-6) {
		wavelengthInput = 7.7e-6;
		$('#wavelength-input').val('7.7');
		$('#wavelength-units').val('0.000001');
	  }
	  else if (wavelengthInput > 770) {
		wavelengthInput = 770;
		$('#wavelength-input').val('770');
		$('#wavelength-units').val('1');
	  }

      $('#frequency-input').val(freqAutoRange(calcFreq(wavelengthInput)));
      $('#sound-slider').slider('value', getSliderVal(calcFreq(wavelengthInput)));
    }
    else {
	  $('#frequency-input').val('');
    }
  }

  function printFreqCalcWavelength() {
	var frequencyInput = 0;
	var freqInputStr = $('#frequency-input').val();

    if ((!isNaN(freqInputStr)) && (freqInputStr.trim() !== '')) {
	  frequencyInput = parseFloat($('#frequency-input').val()) * parseFloat($('#frequency-units').val());
	  if (frequencyInput > 2e8) {
		frequencyInput = 2e8;
		$('#frequency-input').val('200');
		$('#frequency-units').val('1000000');
	  }
	  else if (frequencyInput < 2) {
		frequencyInput = 2;
		$('#frequency-input').val('2');
		$('#frequency-units').val('1');
	  }

      $('#wavelength-input').val(wavelengthAutoRange(calcWavelength(frequencyInput)));
      $('#sound-slider').slider('value', getSliderVal(frequencyInput));
    }
    else {
	  $('#wavelength-input').val('');
    }
  }

  function calcFreq(wl) {
	return (1540 / wl);
  }

  function calcWavelength(freq) {
    return (1540 / freq);
  }

  function getSliderVal(input) {
	return (Math.log(input) / Math.log(10)).toFixed(5);
  }

  function freqAutoRange(freq) {
	var freqDisplay = 0;
	var freqExp = freq.toExponential();
	var freqExpSplit = freqExp.split('e');
	var freqCoef = parseFloat(freqExpSplit[0]);
	var freqExponent = parseInt(freqExpSplit[1]);

	if (freqExponent >= 6) {
      $('#frequency-units').val('1000000');
      freqDisplay = freq / 1000000;
	}
	else if (freqExponent >= 3) {
      $('#frequency-units').val('1000');
      freqDisplay = freq / 1000;
	}
	else {
      $('#frequency-units').val('1');
      freqDisplay = freq / 1;
	}

	return parseFloat(freqDisplay.toPrecision(4));
  }

  function wavelengthAutoRange(wl) {
	var wlDisplay = 0;
	var wlExp = wl.toExponential();
	var wlExpSplit = wlExp.split('e');
	var wlCoef = parseFloat(wlExpSplit[0]);
	var wlExponent = parseInt(wlExpSplit[1]);

	if (wlExponent <= -6) {
		$('#wavelength-units').val('0.000001');
		wlDisplay = wl / 0.000001;
	}
	else if (wlExponent <= -3) {
		$('#wavelength-units').val('0.001');
		wlDisplay = wl / 0.001;
	}
	else {
		$('#wavelength-units').val('1');
		wlDisplay = wl / 1;
	}

	return parseFloat(wlDisplay.toPrecision(4));
  }
});