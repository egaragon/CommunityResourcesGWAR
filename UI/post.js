const e = require("express");

//get reference in js to form
const form1 = document.getElementById('form1');

//listen for form submit event
form1.addEventListener('submit', e => {
  
  //when that event happens prevent default behaviour and get Form Data from form
  e.preventDefault();
  const formData = new FormData(form1);

  let dataToSubmit = {};
  let checkedBoxes = [];
  

  if(placeSelected){
    console.log(placeSelected);
    console.log('alert should fire');
    alert('Please Select an Autocomplete Option');
    return;
  }

  //iterate through each key value pair in the form data
  formData.forEach((value, key) => {

    //if the value of the input is 'on' assume it's a checkbox and add to array
    if (value === 'on') {
      checkedBoxes.push(key);
    }
    else {
      dataToSubmit[key] = value;
    }
  });

  //add checked boxes to submission object
  dataToSubmit.resourceCategory = checkedBoxes;
  
  //submit or here we just log
  console.log(dataToSubmit);
  if(placeSelected) {
    fetch('http://localhost:5000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSubmit),
    })
    .then(res => res.json())
    .then(dataToSubmit => {
      console.log('Success:', dataToSubmit);
    })
    .catch((error) => {
      console.error('Error:', error);
    })
  }

});

let autocomplete;
let placeSelected = false;//check if an autocomplete selection was made
 

function newFunction() {
  let autocomplete;
  return autocomplete;
}

function initAutocomplete() {
  
  console.log('initAutocomplete Called')
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('autocomplete'),
      {
        types: ['address'],
        componentRestrictions: {'country' : ['US']},
        fields: ['address_component']
      });
  autocomplete.addListener('place_changed', onPlaceChanged);
}

//this function means a place was selected
function onPlaceChanged() { 
  let place = autocomplete.getPlace();

  placeSelected = true;
  console.log(placeSelected);
  
  console.log('PLACE:', place);

  if(place.address_component) {
    console.log(place);
  }
} 





