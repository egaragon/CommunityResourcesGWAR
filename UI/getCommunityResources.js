let searchObject;

fetch('http:localhost:5000', {
    method: 'GET'
})
.then(res => res.json())
.then(data => {
    searchObject = data.recordset.map(element => {
        let fieldValues = `${element.resourceName} ${JSON.parse(element.resourceCategory).join(', ')} 
            ${element.resourceAddress} ${element.county} ${element.Website} ${element.phoneNumber} ${element.information}`;
        return {
            id: element.ResourceID, 
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
    row.setAttribute('id','row' + resource.ResourceID);
    searchTable.appendChild(row);

    //insert cell information
    for(const [key, value] of Object.entries(resource)) {
        if(key !== 'resourceID') {
            const cell = document.createElement('td');
            
            if(key === 'ResourceCategory') {
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

    let filteredList = searchObject.filter(element => !element.string.includes(searchString));
    filteredList.forEach(idToHide => {
        document.getElementById('row' + idToHide.id).setAttribute('class', 'hidden');
    })
    
    let defilteredList = searchObject.filter(element => element.string.includes(searchString));
    defilteredList.forEach(idToHide => {
        document.getElementById('row' + idToHide.id).classList.remove('hidden');
    })
    
});