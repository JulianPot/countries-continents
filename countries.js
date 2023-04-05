const getCountries = async () => {
  document.getElementById("countries").innerText = "loading....";

  const continent = document.getElementById("continents").value;
  let countriesDisplayNum = document.getElementById("quantity").value;
  let continentID;

  if (countriesDisplayNum < 2 || countriesDisplayNum > 10) {
    alert("Wrong number of countries to display!");
    return;
  }

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
    console.log(countriesArray);

    if (countriesArray.length < countriesDisplayNum) {
      countriesDisplayNum = countriesArray.length;
      alert("There is less countries than you want to display!")
    }

    document.getElementById("countries").innerText = "";

    for (let i = 0; i < countriesDisplayNum; i++) {
      const fragment = document.createDocumentFragment();
      const li = fragment
        .appendChild(document.createElement("ul"))
        .appendChild(document.createElement("li"));
      li.textContent = countriesArray[i].name;

      document.getElementById("countries").appendChild(fragment);
    }
  } catch (err) {
    console.log(err);
  }
};
