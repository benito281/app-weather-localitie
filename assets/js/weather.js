let weather = document.getElementById("weather-localities");
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

export const weatherInformation = async (localitie,apiKey) => {
  try {
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${localitie}&appid=${apiKey}`;
    let data = await fetch(url);
    let response = await data.json();
    return response;
  } catch (error) {
    return false;
  }
}

export const viewInformation = async (func) => {
  let localitie = await func;
  if (localitie.cod === '404') {
    Swal.fire({
      icon: 'warning',
      title: 'Error',
      text: '¡No se encontro la localidad seleccionada!',
    });
  }
  if (localitie === false) {
    Swal.fire({
      icon: 'error',
      title: 'Error fatal',
      text: '¡No hay registros del clima de la localidad seleccionada!',
    });
  }
  else{ 
  return weather.innerHTML = `
  <div class="card mx-auto mb-4 w-75">
  <div class="card-header">
    <p class="h2 text-center">${localitie.name}</p>
  </div>
<div class="card-body">
  <table class="table table-bordered">
          <thead>
              <tr class="text-center">
                  <th scope="col"></th>
                  <th scope="col">Temperatura</th>
                  <th scope="col">Sensión termica</th>
                  <th scope="col">Viento</th>
                  <th scope="col">Humedad</th>
                  <th scope="col">Estados</th>
                  <th scope="col">Presion atmosferica</th>
                  <th scope="col">Visibilidad</th>
              </tr>
          </thead>
          <tbody class="text-center font-weight-bold w-75">
              <tr>
                  <td scope="row" ><img src="http://openweathermap.org/img/wn/${localitie.weather[0].icon}@2x.png" alt="card-img-top align-center" style="max-width:200px !important;"></td>
                  <td>${Math.round(localitie.main.temp-273.15)}°C</td>
                  <td>${Math.round(localitie.main.feels_like-273.15)}°C</td>
                  <td>${Math.round(localitie.wind.speed)} m/s</td>
                  <td>${localitie.main.humidity}%</td>
                  <td>${mainDict[localitie.weather[0].main]}</td>
                  <td>${localitie.main.pressure} hPa</td>
                  <td>${Math.round(localitie.visibility/1000)} Km</td>
              </tr>
          </tbody>
   </table>
</div>
</div>
  `;
  }
}
