
import './App.css';
import {useState, useEffect} from 'react';
import {FormControl, Select, MenuItem, Card, CardContent} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from "./Map";
import Table from './Table';
import {prettyPrintStat, sortData} from './util.js';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";


function App() {
  //State is basically how you write a variable in react.
  const [countries, setCountries] = useState([]);
  const[country, setCountry] = useState('worldwide');
  const[countryInfo, setcountryInfo] = useState({});
  const[tableData, setTableData]=useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const[mapZoom, setMapZoom] = useState(3);
  const[mapCountries, setMapCountries] = useState([]);
  const[casesType, setCasesType] = useState("cases");

  //useEffect runs a piece of code based on a give condtion
  // when [] it fires off the code inside useEffect once when the app load
  // when [] has some parameters passed to it it fires off againg when those 
  //parameters changes
  //can use more than one useEffects
    useEffect(()=> {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then((data) => {
      setcountryInfo(data);
    });
  }, []);

  useEffect(() => {
    //asyn -> send a request, wait for it, do something with it
    const getCountriesData = async() => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country, // United states, united kingdom
            value: country.countryInfo.iso2 // USA, UK, FR
          }
        ));
         const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    }

    getCountriesData();
  }, []);

  const onCountryChange = async(event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = (countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : 
    `https://disease.sh/v3/covid-19/countries/${countryCode}`)

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setcountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })
  };
  console.log(countryInfo);

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app_dropdown">
            <Select variant="outlined" 
            onChange={onCountryChange}
            value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>

                {/*Loop through all the countries
                and show a drop down list of the options 
                */}
              {countries.map(country =>(
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}

            </Select>
          </FormControl>
        </div>
        
        <div className="app_stats">
          <InfoBox 
          isRed
          active={casesType === 'cases'}
          onClick={e => setCasesType('cases')} 
          title="COVID cases" 
          cases={prettyPrintStat(countryInfo.todayCases)} 
          total={countryInfo.cases} 
          />

          <InfoBox 
          active={casesType === 'recovered'}
          onClick={e => setCasesType('recovered')} 
          title="Recovered" 
          cases={prettyPrintStat(countryInfo.todayRecovered)} 
          total={countryInfo.recovered} 
          />

          <InfoBox 
          isRed
          active={casesType === 'deaths'}
          onClick={e => setCasesType('deaths')} 
          title="Deaths" 
          cases={prettyPrintStat(countryInfo.todayDeaths)} 
          total={countryInfo.deaths} 
          />
        </div>

      

        {/* Map */}
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app_right">
      <CardContent>
       {/* Table */}
      <h3>Live Cases by Country</h3>
      <Table countries={tableData} />
      
      <h3 className="app_graphTitle">World Wide New {casesType}</h3>
      
      </CardContent>

       
      
        {/* Graph */}
        <LineGraph
        className="app_graph"
        casesType = {casesType} 
        />
      
      </Card>
 
    </div>
  );
}

export default App;
