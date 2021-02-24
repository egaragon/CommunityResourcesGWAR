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
            string: fieldValues.toLowerCase()
            
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
    searchTable.appendChild(row);

    //insert cell information
    for(const [key, value] of Object.entries(resource)) {
        if(key !== 'resourceID') {
            const cell = document.createElement('td');
            
            if(key === 'resourceCategory') {
                const parsed = JSON.parse(value);
                cell.innerHTML = parsed.join(', ');
            }
            else {
                cell.innerHTML = value;
            }
            row.appendChild(cell);
        }
    }
}

const nameSearch = document.getElementById('nameSearch');



nameSearch.addEventListener('input', e => {
    const searchString = e.target.value.toLowerCase();

    
   
    let thingsToUnhide = searchObject.filter(element => element.string.includes(searchString));
    thingsToUnhide.forEach(idToHide => {
        document.getElementById('row' + idToHide.id).classList.remove('hidden');
    })
    
    let thingsToHide = searchObject.filter(element => !element.string.includes(searchString))
    
    thingsToHide.forEach(idToHide => {
        document.getElementById('row' + idToHide.id).setAttribute('class', 'hidden');
    })
    
});