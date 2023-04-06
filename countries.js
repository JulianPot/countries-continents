const getCountries = async () => {
  const continent = document.getElementById("continents").value;
  let countriesDisplayNum = document.getElementById("quantity").value;
  let continentID;

  if (countriesDisplayNum < 2 || countriesDisplayNum > 10) {
    alert("Wrong number of countries to display!");
    document.getElementById("countries").innerText = "";
    return;
  }

  document.getElementById("countries").innerText = "loading....";

  if (continent === "Africa") {
    continentID = 0;
  } else if (continent === "Antarctica") {
    continentID = 1;
  } else if (continent === "Asia") {
    continentID = 2;
  } else if (continent === "Europe") {
    continentID = 3;
  } else if (continent === "NorthAmerica") {
    continentID = 4;
  } else if (continent === "Oceania") {
    continentID = 5;
  } else if (continent === "SouthAmerica") {
    continentID = 6;
  }

  try {
    const result = await fetch(`https://countries.trevorblades.com/graphql`, {
      method: `POST`,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `{
                    continents {
                      countries {
                        name
                      }
                    }
                  }`,
      }),
    });
    const countries = await result.json();
    const countriesArray = countries.data.continents[continentID].countries;

    const countriesArrayMixed = [...countriesArray];

    for (let i = 0; i < countriesArrayMixed.length; i++) {
      const randomPosition = Math.floor(
        (countriesArrayMixed.length - i) * Math.random()
      );
      const randomItem = countriesArrayMixed.splice(randomPosition, 1);

      countriesArrayMixed.push(...randomItem);
    }

    if (countriesArray.length < countriesDisplayNum) {
      countriesDisplayNum = countriesArray.length;
      alert("There is less countries than you want to display!");
    }

    document.getElementById("countries").innerText = "";

    for (let i = 0; i < countriesDisplayNum; i++) {
      const fragment = document.createDocumentFragment();
      const li = fragment
        .appendChild(document.createElement("ul"))
        .appendChild(document.createElement("li"));
      li.textContent = countriesArrayMixed[i].name;
      li.onclick = () => getCountryDetails(countriesArrayMixed[i].name);
      li.setAttribute("id", countriesArrayMixed[i].name);

      document.getElementById("countries").appendChild(fragment);
    }
  } catch (err) {
    console.log(err);
  }
};

const getCountryDetails = async (countryName) => {
  document.getElementById(countryName).innerText = "loading details....";

  try {
    const result = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}`
    );
    const countryData = await result.json();

    const getDataWithoutKey = (data) => {
      let object = data;
      for (let key in object) {
        if (object.hasOwnProperty(key)) {
          return object[key];
        }
      }
    };

    document.getElementById(countryName).innerHTML = `
        <h3>${countryName}</h3>
        <p>Official name: ${
          typeof countryData[0].name.official === "string"
            ? countryData[0].name.official
            : "No information found!"
        }</p>
        <p>Capital: ${
          typeof countryData[0].capital === "object"
            ? countryData[0].capital
            : "No information found!"
        }</p>
        <p>Population: ${
          typeof countryData[0].population === "number"
            ? countryData[0].population
            : "No information found!"
        }</p>
        <p>Currency: ${
          typeof getDataWithoutKey(countryData[0].currencies).name === "string"
            ? getDataWithoutKey(countryData[0].currencies).name
            : "No information found!"
        }</p>
        <p>Subregion: ${
          typeof countryData[0].subregion === "string"
            ? countryData[0].subregion
            : "No information found!"
        }</p>
        <p>Languages: ${
          typeof getDataWithoutKey(countryData[0].languages) === "string"
            ? getDataWithoutKey(countryData[0].languages)
            : "No information found!"
        }</p>
        `;
  } catch (err) {
    console.log(err);
  }
};
