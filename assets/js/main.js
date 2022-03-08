import { weatherInformation, viewInformation } from './weather.js';
let url = 'assets/json/';
let selectProvinces = document.querySelector('#provinces');
let selectDepartments = document.querySelector('#departments');
let optionsSelect, element,idProvince, idDepartments;
let selectLocalities = document.querySelector('#localities');


const getProvinces = async () => {
    let response = await fetch(url + 'provincias.json');
    let result = await response.json();
    return result.provincias;
}
const getDepartments = async () => {
    let response = await fetch(url + 'departamentos.json');
    let result = await response.json();
    return result.departamentos;
}
const getLocalities = async () => {
    let response = await fetch(url + 'localidades.json');
    let result = await response.json()
    return result.localidades;
}

/* Se visualizan las provincias a seleccionar */
const viewProvince =  async (arr, elementSelected) => {
    optionsSelect = '<option selected disabled>Secciona una provincia</option>';
    element = await arr;
        element.forEach(( item ) => {
            optionsSelect += '<option value="' + item.id + '">' + item.nombre  + '</option>';
        });
    elementSelected.innerHTML = optionsSelect;
}

viewProvince(getProvinces(), selectProvinces)

/* Se viualizan los departamentos a seleccionar */
selectProvinces.addEventListener('change', async () => {
    idProvince = selectProvinces.value;
    let departments = await getDepartments();
    optionsSelect = '<option selected disabled>Selecciona un departamento</option>';
    departments.forEach(( item ) => {
        if (idProvince === item.provincia.id) {
            optionsSelect += '<option value="' + item.id + '">' + item.nombre  + '</option>';
        }
    });
    selectDepartments.innerHTML = optionsSelect;
});

/* Se visualizan las localidades a seleccionar */
selectDepartments.addEventListener('change', async () => {
    idDepartments = selectDepartments.value;
    let localities = await getLocalities();
    optionsSelect = '<option selected disabled>Selecciona una localidad</option>';
    localities.forEach(( item ) => {
        if (idDepartments === item.departamento.id) {
            optionsSelect += '<option value="' + item.nombre + '">' + capitalizeWords(item.nombre) + '</option>';
        }
    });
    selectLocalities.innerHTML = optionsSelect;
});

/* Visualizamos el estado del clima en la localidad */
selectLocalities.addEventListener('change', function(e){
    e.preventDefault();
    let localitieSelected = (e.target.value).toLowerCase();
    viewInformation(weatherInformation(localitieSelected, 'c65e070d8c831edc8f57b3eba86a147f'));
    
})

/* Se convierten las primeras palabras de las oraciones en mayusculas */
const capitalizeWords = (words) => {
    return words.toLowerCase().trim().split(' ')
    .map( v => v[0].toUpperCase() + v.substr(1) )
    .join(' ');
}

