import './public/assets/css/mdb.min.css';
import './public/assets/css/style.css';


document.querySelector('#app').innerHTML = `
   <div class="container py-5 h-100">
    <!-- Ingreso de elementos y visualización del estado del clima -->
    <div class="card my-2 p-4">
      <div class="row d-flex justify-content-center align-items-center">
        <div class="col-md-6">
          <div class="card-body">
            <div class="form-group">
              <label for="provinces" class="text-primary text-uppercase">Provincia</label>
              <select class="form-select" aria-label="Default select example" id="provinces">
                <!-- Provinces -->
              </select>
            </div>
            <div class="form-group my-2">
              <label for="districts" class="text-primary text-uppercase">Departamento</label>
              <select class="form-select" aria-label="Default select example" id="districts">
                <!-- districts -->
              </select>
            </div>
            <div class="form-group my-2">
              <label for="localities" class="text-primary text-uppercase">Localidad</label>
              <select class="form-select" aria-label="Default select example" id="localities">
                <!-- localities -->
              </select>
              <div class="d-flex">
                <!-- <h6 class="flex-grow-1">Warsaw</h6> -->
                <h6 class="flex-grow-1 my-2 fw-bold" id="clock-real-time"></h6>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div id="results">
            <p class="fw-bold" id=>Seleccione la provincia, departamento y localidad, el resultado del clima se
              visualizara aqui.
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- Información de la localidad -->
    <div class="card my-2 p-4">
      <div id="data-localitie">
        <p class="text-center h5">Aquí se visualizaran la información de la localidad</p>
      </div>
    </div>
  </div>

`;


window.addEventListener("load", function() {
  viewProvince();
  clockRealTime();
});

//Api de provincias, departamento y localidades de Argentina
const provincesData = new URL('./public/assets/json/provincias.json', import.meta.url).href
const districtsData = new URL('./public/assets/json/departamentos.json', import.meta.url).href
const localitiesData = new URL('./public/assets/json/localidades.json', import.meta.url).href
//Iconos
const iconsUrl = new URL('./public/assets/icons', import.meta.url).href
const apiKEY = import.meta.env.VITE_API_KEY; //Definir en la variable de entorno la API_KEY de OpenWeather
let selectProvinces = document.querySelector('#provinces');
let selectDistricts = document.querySelector('#districts');
let optionsSelect, idProvince, idDistricts;
let selectLocalities = document.querySelector('#localities');
const results = document.querySelector("#results");
const resultsLocalitie = document.querySelector("#data-localitie");

//Estado del clima
const mainDict = {
  Thunderstorm: 'Tormenta',
  Drizzle: 'Llovizna',
  Rain: 'Lluvia',
  Snow: 'Nieve',
  Mist: 'Bruma',
  Smoke: 'Humo',
  Haze: 'Neblina',
  Dust: 'Polvo',
  Fog: 'Niebla',
  Sand: 'Arena',
  Ash: 'Ceniza',
  Squall: 'Chubasco',
  Tornado: 'Tornado',
  Clear: 'Despejado',
  Clouds: 'Nubes',
}

/*Obtenemos las provincias, departamentos y localidades desde los archivos */
async function getProvinces() {
  try {
    const response = await fetch(provincesData);
    const result = await response.json();
    return result.provincias;
  }
  catch (error) {
    return false;
  }
}
async function getDistricts() {
  const response = await fetch(districtsData);
  const result = await response.json();
  return result.departamentos;
}
async function getLocalities() {
  const response = await fetch(localitiesData);
  const result = await response.json()
  return result.localidades;
}

/* Se visualizan las provincias a seleccionar */
async function viewProvince() {
  optionsSelect = '<option selected disabled>Secciona una provincia</option>';
  const provinces = await getProvinces(); //Arreglo de provincias
  for (let i = 0; i < provinces.length; i++) {
    const item = provinces[i];
    optionsSelect += '<option value="' + item.id + '">' + item.nombre + '</option>'; 
  }
  selectProvinces.innerHTML = optionsSelect;
}


/* Se visualizan los departamentos a seleccionar */
selectProvinces.addEventListener('change', async function() {
  idProvince = selectProvinces.value;
  const districts = await getDistricts();
  optionsSelect = '<option selected disabled>Selecciona un departamento</option>';
  for (let i = 0; i < districts.length; i++) {
    const item = districts[i];
    if (idProvince === item.provincia.id) {
        optionsSelect += '<option value="' + item.id + '">' + item.nombre + '</option>';
      }
  }
  selectDistricts.innerHTML = optionsSelect;
});

/* Se visualizan las localidades a seleccionar */
selectDistricts.addEventListener('change', async function(e) {
  e.preventDefault()
  idDistricts = selectDistricts.value;
  const localities = await getLocalities();
  optionsSelect = '<option selected disabled>Selecciona una localidad</option>';
  for (let i = 0; i < localities.length; i++) {
    const item = localities[i];
    if (idDistricts === item.departamento.id) {
        optionsSelect += '<option value="' + item.nombre + '" > ' + capitalizeWords(item.nombre) + '</option>';
      }
  }
 
  selectLocalities.innerHTML = optionsSelect;

});

/* Visualizamos el estado del clima en la localidad */
selectLocalities.addEventListener('change', function(e) {
  e.preventDefault();
  let localitieSelected = (e.target.value).toLowerCase();

  weatherInformation(localitieSelected, apiKEY);
  viewInformationLocalitie(idDistricts, localitieSelected);
})

/* Se convierten las primeras palabras de las oraciones en mayusculas */
const capitalizeWords = (words) => {
  return words.toLowerCase().trim().split(' ')
    .map(v => v[0].toUpperCase() + v.substr(1))
    .join(' ');
}

//Reloj en tiempo real
function clockRealTime() {
  const dateCurrently = new Date();
  let hours, minutes;
  hours = dateCurrently.getHours();
  minutes = dateCurrently.getMinutes();
  document.querySelector("#clock-real-time").innerText = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes }`;
  setTimeout(clockRealTime, 1000);
}

//Limpieza de elementos
function cleanHTML(div) {
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
}

//Visualización de información del clima de la localidad
function viewinformation(response) {
  
  const { main: { temp, feels_like, temp_min, temp_max, humidity }, name, weather: [{ main, icon }], wind: { speed } } = response;

  const information = document.createElement("div");

  information.innerHTML = `
    <p class="h2 text-center my-2">${name}</p>
    <div class="row d-flex align-items-center">
      <div class="col-md-6 justify-content-center text-center">
        <p class="h2 text-centigrades">${kelvinTocentigrades(temp)} &#8451</p>
      </div>
      <div class="col-md-6 text-center">
        <img src="${iconsUrl}/${icon}.svg" class="img-fluid img-icon" >
      </div>
    </div>
    <p class="h4 text-center my-2">Estado del clima: ${conditionOfWeatherTraduction(main)}</p>
    <p class="h4 text-center my-2">Sensación termica ${kelvinTocentigrades(feels_like)} &#8451</p>
     <div class="row d-flex">
      <div class="col-md-4 text-center">
        <div class="flex-grow-1" style="font-size: 1rem;">
                <div><i class="fas fa-wind fa-fw" style="color: #868B94;"></i> <span class="ms-1"> ${Math.round((speed*3600)/1000)} km/h
                  </span></div>
                <div><i class="fas fa-tint fa-fw" style="color: #868B94;"></i> <span class="ms-1"> ${humidity}% </span></div>
      </div>
     </div>
      <div class="col-md-4 text-center">
        <p class="h4">Min : ${kelvinTocentigrades(temp_min)} &#8451</p>
     </div>
     <div class="col-md-4 text-center">
        <p class="h4">Max : ${kelvinTocentigrades(temp_max)} &#8451</p>
     </div>
     </div>
  `;

  results.appendChild(information);
}

//Convertimos de Kelvin a Centigrados
const kelvinTocentigrades = grad => parseInt(grad - 273.15);


//Información del clima
async function weatherInformation(localitie, apiKey) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${localitie}&appid=${apiKey}`;
    const data = await fetch(url);
    const response = await data.json();
    if (response.cod === "404") {
      cleanHTML(results);
      const message = document.createElement("p");
      message.textContent = "Localidad o ciudad no encontrada";
      message.classList.add("h4", "text-center", "my-2", "text-danger");
      results.appendChild(message);
      return false;
    }
    cleanHTML(results);
    viewinformation(response);
  } catch (error) {
    console.error(error);
  }
}

//Traducción del estado del clima
const conditionOfWeatherTraduction = (state) => {
  let condition;
  Object.keys(mainDict).map(key => {
  if (key === state) condition = mainDict[key];
});
  return condition
}
  //Se obtiene la información de la localidad y se muestra los datos de la misma
 async function viewInformationLocalitie(idDpto, localitieSelected){
   const localities = await getLocalities();
   const localitieFound = localities.find((element) => (element.departamento.id === idDpto && element.nombre === localitieSelected.toUpperCase()));

    if(localitieFound) {
      const { nombre, departamento, categoria, centroide : { lat, lon }, localidad_censal, provincia } = localitieFound;
      const tableLocalitie = document.createElement("div");
      tableLocalitie.classList.add('table-responsive');
      cleanHTML(resultsLocalitie);
      tableLocalitie.innerHTML = `
      <table class="table table-bordered">
        <thead>
          <tr class="text-center">
            <th scope="col">ID Localidad</th>
            <th scope="col">Nombre</th>
            <th scope="col">Categoria</th>
            <th scope="col">Departamento</th>
            <th scope="col">Provincia</th>
            <th scope="col">Centroide</th>
          </tr>
        </thead>
        <tbody>
    <tr class="text-center">
        <th scope="row">${localidad_censal.id}</th>
          <td>${nombre}</td>
          <td>${categoria}</td>
          <td>${departamento.nombre}</td>
          <td>${provincia.nombre}</td>
          <td>Latitud : ${lat}° </br> Longitud : ${lon}°</td>
    </tr>
        </tbody>
      </table>`;
      resultsLocalitie.appendChild(tableLocalitie);
    }
    return false; 
 }