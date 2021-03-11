let searchObject;

fetch('http:localhost:5000', {
    method: 'GET'
})
.then(res => res.json())
.then(data => {
    searchObject = data.recordset.map(element => {
        let fieldValues = `${element.resourceName} ${element.resourceAddress} ${element.county} 
            ${element.website} ${element.phoneNumber} ${element.information}`;
        
        return {
            id: element.resourceID, 
            string: fieldValues.toLowerCase(),
            categories: JSON.parse(element.resourceCategory.toLowerCase())
            
        }
    });
    data.recordset.forEach(resource => {
        createRow(resource);
    });

});

//function to create rows on HTML page
function createRow(resource) {
    
    //reference to HTML table
    const searchTable = document.getElementById('searchTable');
    
    //create a table row
    const row = document.createElement('tr');
    row.setAttribute('id','row' + resource.resourceID);
    row.setAttribute('class', 'record');
    searchTable.appendChild(row);



    //insert cell information
    for(const [key, value] of Object.entries(resource)) {
        if(key !== 'resourceID') {
            const cell = document.createElement('td'); 
            
            if(key === 'resourceCategory') {
                const parsed = JSON.parse(value);
                cell.innerHTML = parsed.join(', ');
            }
            else if(key === 'website') {
                cell.innerHTML = `<a href="http://${value}" target="_blank"> ${value} </a>`;
            }
            else {
                cell.innerHTML = value;
            }
            row.appendChild(cell);
        }
    }
}

const nameSearch = document.getElementById('nameSearch'); 
const checkboxes = document.querySelectorAll('#categoryCheckboxes'); 
let categoryToSearchFor = []; //empty array to put checkbox values in
let searchString = ''; //initialize the variable that holds the string in the searchbox

//listening for any time a checkbox is checked/unchecked
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', e => {
        
        if(e.target.checked) {
            categoryToSearchFor.push(e.target.id.toLowerCase()); //push checkbox checked values into array
            console.log('category to search for:', categoryToSearchFor);
            console.log('target id:', e.target.id);
        }
        else {
            let index = categoryToSearchFor.indexOf(e.target.id);
            categoryToSearchFor.splice(index, 1); //remove unchecked values from array
        }

        applyFilter(searchString, categoryToSearchFor);
    })
})

function applyFilter(searchString, searchCategories) {
    const records = Array.from(document.getElementsByClassName('record'));
    
    //console.log(records);

    let thingstoUnhide = searchObject.filter(element => {
        let matchesCategory = searchCategories.every(category => {
            return element.categories.includes(category);
        })
        let matchesString = element.string.includes(searchString);

        return matchesCategory && matchesString;
    })

    thingstoUnhide.forEach(thingToUnhide => {
        document.getElementById('row' + thingToUnhide.id).classList.remove('hidden');
    })

    let thingsToHide = searchObject.filter(element => {
        
        let matchesCategory = searchCategories.every(category => {
            return element.categories.includes(category);
        })
        let matchesString = element.string.includes(searchString);

        return !matchesCategory || !matchesString;
    })

    thingsToHide.forEach(thingToHide =>{
        document.getElementById('row' + thingToHide.id).setAttribute('class', 'hidden');
        //console.log(`Thing to Hide: ${thingsToHide}`);
    })

}


nameSearch.addEventListener('input', e => {
    searchString = e.target.value.toLowerCase();
    applyFilter(searchString, categoryToSearchFor);
   
});