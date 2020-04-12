

const conf = document.getElementById('confirmed');
const rec = document.getElementById('recoverd');
const death = document.getElementById('deaths');
const crit = document.getElementById('critical');
const conf1 = document.getElementById('confirmed1');
const rec1 = document.getElementById('recoverd1');
const death1 = document.getElementById('deaths1');
const crit1 = document.getElementById('critical1');
const new_deaths = document.getElementById('new_deaths');
const new_cases = document.getElementById('new_cases');
const date = document.getElementById('date');
const new_sa = document.getElementById('new_sa');
const active_sa = document.getElementById('active_sa');
const active_total = document.getElementById('active_total');





//showSlides
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}


//fetch the latest covid-19 cases in saudi arabia

fetch("https://covid-193.p.rapidapi.com/statistics?country=Saudi-Arabia", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "covid-193.p.rapidapi.com",
		"x-rapidapi-key": "93a254dabcmsh90ded90d46d74c6p178d82jsn933674dbaff6"
	}
})
.then(response => response.json().then(data =>{
  let sa = data.response[0]
  console.log(data.response[0]);
  conf.innerHTML = sa.cases.total;
  new_sa.innerHTML = `(${sa.cases.new})`;
  death.innerHTML = sa.deaths.total;
  crit.innerHTML = sa.cases.critical;
  rec.innerHTML = sa.cases.recovered;
  date.innerHTML = `Updated Date: ${sa.day}`;
  active_sa.innerHTML = `Active Cases In Saudi: <br>الحالات النشطة في السعودية 
  <br><hr id="hr1"><br> ${sa.cases.active}`;
}))
.catch(err => {
	console.log(err);
});



//fetch the latest covid data in the world

fetch("https://covid-193.p.rapidapi.com/statistics?country=all", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "covid-193.p.rapidapi.com",
		"x-rapidapi-key": "93a254dabcmsh90ded90d46d74c6p178d82jsn933674dbaff6"
	}
})
.then(response => response.json().then(data =>{
  console.log(data);
  const allCases = data.response[0];  

  conf1.textContent = allCases.cases.total;
  new_cases.innerHTML = `(${allCases.cases.new})`;

      rec1.textContent = allCases.cases.recovered;
      death1.textContent = allCases.deaths.total;
      new_deaths.innerHTML= `(${allCases.deaths.new})`;
      crit1.textContent = allCases.cases.critical;
      active_total.innerHTML = `Active Cases Around The World: <br>
       الحالات النشطة في العالم<br><hr id="hr1"></hr>${allCases.cases.active}`;
}))
.catch(err => {
	console.log(err);
});



//chart 1
chartIt();
async function chartIt() {
const data = await getData();
const ctx = document.getElementById('chart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: data.xlables,
        datasets: [{
            label: 'Number of Cases (الحالات المسجلة)',
            fill: false,
            data: data.ylables,
            backgroundColor: 
                'rgba(255, 99, 132, 0.2)',
            borderColor: 
                'rgba(255, 99, 132, 1)',
            borderWidth: 1},
          {
            label: 'Number of Recoverd (التعافي)',
            fill: false,
            data: data.yrec,
            backgroundColor: 
            'rgba(255, 99, 132, 0.2)',
            borderColor: 
            'rgb(64, 148, 64)',
            borderWidth: 1,
          }]
    }
   
});
};

async function getData() {
  const xlables = [];
  const ylables = [];
  const yrec = [];
  const response = await fetch("https://pomber.github.io/covid19/timeseries.json");
  const data = await response.json();
  const table = data;
  data["Saudi Arabia"].forEach(({ date , confirmed, recovered, deaths }) => {
    if (date > '2020-3-1' ) {
      const day = date;
    xlables.push(day);
    const cases = confirmed;
    ylables.push(cases);
    yrec.push(recovered);
    console.log(day, cases, recovered);
  }});
  return { xlables, ylables, yrec };
}

//chart end

//chart 2

chartTotal();
async function chartTotal() {
const data = await getTotal();
const ctx = document.getElementById('chart2').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: data.xlables,
        datasets: [{
            label: 'Number of Deaths (الوفيات)    ',
            fill: false,
            data: data.ylables,
            backgroundColor: 
                'rgba(255, 99, 132, 0.2)',
            borderColor: 
                'rgba(255, 99, 132, 1)',
            borderWidth: 1},
          {
            label: 'Number of Recoverd (التعافي)',
            fill: false,
            data: data.yrec,
            backgroundColor: 
            'rgba(255, 99, 132, 0.2)',
            borderColor: 
            'rgb(64, 148, 64)',
            borderWidth: 1

          }]
    }
   
});
};

async function getTotal() {
  const xlables = [];
  const ylables = [];
  const yrec = [];
  const response = await fetch("https://pomber.github.io/covid19/timeseries.json");
  const data = await response.json();
  const table = data;
 
  data["Saudi Arabia"].forEach(({ date , confirmed, recovered, deaths }) => {
    if (date > '2020-3-1' ) {
    const day = date;
    xlables.push(day);
    const cases = deaths;
    ylables.push(cases);
    yrec.push(recovered);
    console.log(day, cases, recovered);
   } });
  return { xlables, ylables, yrec };
}


//end of chart 2



//Historical covid data of country -->(saudi arabia)

var tbody = document.getElementById("tbody");

  fetch("https://pomber.github.io/covid19/timeseries.json")
  .then(response => response.json())
  .then(data => { 
    data["Saudi Arabia"].forEach(({ date , confirmed, recovered, deaths }) =>
    { 
    var tr = document.createElement('tr');
    if (date > '2020-3-1' ) {
    tr.innerHTML = `<td>${date}</td><td> ${confirmed}</td><td> ${recovered} </td> <td>${deaths}</td>`;
    tbody.appendChild(tr); }}
    
   
    ); 

});




