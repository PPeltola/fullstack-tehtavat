import { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {
  const api_key = process.env.REACT_APP_API_KEY
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])

  const hook = () => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then(resp => setCountries(resp.data))
  }

  const onSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const handleShow = (country) => {
    setSearch(country)
  } 

  useEffect(hook, [])

  return (
    <div>
      <Search search={search} onChange={onSearchChange} />
      <View search={search} countries={countries} handleShow={handleShow} api_key={api_key} />
    </div>
  )
}

const Search = ({ search, onChange }) => (
  <div>
    find countries <input value={search} onChange={onChange} />
  </div>
)

const View =({ search, countries, handleShow, api_key }) => {
  const filtered = countries.filter(country => country.name.common.includes(search))
  
  if (filtered.length === 1 ) {
    return (
      <div>
        <ComplexEntry country={filtered[0]} api_key={api_key} />
      </div>
    )
  } else if (filtered.length <= 10) {
    return (
      filtered.map((country, i) => <SimpleEntry key={i} country={country} handler={handleShow} />)
    )
  }

  return (
    <div>
      Too many matches, specify another filter
    </div>
  )
}

const SimpleEntry = ({ country, handler }) => (
  <div>{country.name.common} <button onClick={() => handler(country.name.common)}>show</button></div>
)

const ComplexEntry = ({ country, api_key }) => {
  //console.log(api_key)
  return (
    <div>
      <h1>
        {country.name.common}
      </h1>
      <div>
        capital {country.capital[0]}
      </div>
      <div>
        area {country.area}
      </div>
      <h4>
        languages:
      </h4>
      <Languages languages={country.languages} />
      <Flag flag={country.flags.png} />
      <Weather capital={country.capital[0]} api_key={api_key} />
    </div>
  )
}

const Languages = ({ languages }) => {
  return (
    <ul>
      {Object.values(languages).map((lang, i) => <li key={i}>{lang}</li>)}
    </ul>
  )
}

const Flag = ({ flag }) => (
  <img src={flag} />
)

const Weather = ({ capital, api_key }) => {
  const [temp, setTemp] = useState(0)
  const [wind, setWind] = useState(0)
  const [image, setImage] = useState("02d")

  const setWeather = (data) => {
    setTemp((data.main.temp -273.15).toFixed(2))
    setImage(data.weather[0].icon)
    setWind(data.wind.speed)
  }

  const weatherHook = () => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}`)
      .then(resp => setWeather(resp.data))
  }

  useEffect(weatherHook, [])

  return (
    <div>
      <h4>
        Weather in {capital}
      </h4>
      <div>
        temperature {temp} Celsius
      </div>
      <img src={`https://openweathermap.org/img/wn/${image}@2x.png`} />
      <div>
        wind {wind} m/s
      </div>
    </div>
  )
}

export default App
