//get reference in js to form
const form1 = document.getElementById('form1');

let county;

//listen for form submit event
form1.addEventListener('submit', e => {
  
  //when that event happens prevent default behaviour and get Form Data from form
  e.preventDefault();
  const formData = new FormData(form1);

  let dataToSubmit = {};
  let checkedBoxes = [];
  console.log(placeSelected);

  if(!placeSelected){
    alert('Please Select an Autocomplete Option');
    return;
  }

  //iterate through each key value pair in the form data
  formData.forEach((value, key) => {

    //if the value of the input is 'on' assume it's a checkbox and add to array
    if (value === 'on') {
      checkedBoxes.push(key);
      console.log(key);
    }
    else {
      dataToSubmit[key] = value;
    }
  });

  //add checked boxes to submission object
  dataToSubmit.resourceCategory = checkedBoxes;
  dataToSubmit.county = county;
  
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
 

function initAutocomplete() {
  
  console.log('initAutocomplete Called')
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('resourceAddress'),
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
  county = place.address_components.find(element => element?.long_name?.includes('County'));
  console.log(county);
  county = county?.long_name;
  
  placeSelected = true;
    
  console.log('PLACE:', place);

  if(place.address_component) {
    console.log(place);
  }
  
} 

