document.addEventListener("DOMContentLoaded", e => {});

// converts search button to search bar -> would look nice animated
const handleSearchClick = e => {
  searchButton.innerHTML =
    "<input type = 'text' placeholder = 'Your search here...' id = 'search-box'> </input> <button class = 'btn btn-primary fa fa-search' id = 'second-search'></button>";
  searchButton.classList = "btn btn-primary";
  searchButton.removeEventListener("click", handleSearchClick);
  document
    .getElementById("second-search")
    .addEventListener("click", handleSearch);
};
const searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", handleSearchClick);

const handleSearch = e => {
  const searchValue = document.getElementById("search-box").value;
  console.log(searchValue);

  // calls XML http request for the input search value
  const xhr = new XMLHttpRequest();
  const params = JSON.stringify({
    action: "opensearch",
    search: searchValue,
    limit: 5,
    namespace: 0,
    format: "json"
  });
  xhr.open(
    "GET",
    `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search=${searchValue}`,
    true
  );
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xhr.send(params);
  // logs the results of the search
  xhr.onreadystatechange = () => {
    // an array in format [0: "searchvalue", 1: [search result names], 2: [search result summaries], 3: [result URLs]]
    // gives top 10 results
    const results = JSON.parse(xhr.response);
    console.log(results);

    // clears previous results
    let table = document.getElementById("results-table");
    if (!results[1].length) {
      table.innerHTML = "";
      let row = table.insertRow(0);
      let cell = row.insertCell(0);
      cell.innerHTML = "no results found";
    } else {
      table.innerHTML = "";
    }
    // loop through search results, display in table
    //TODO : table formatting
    for (let i = 0; i < results[1].length; i++) {
      console.log(results[1][i], results[2][i], results[3][i]);
      let row = table.insertRow(i);
      let cellTitleAndLink = row.insertCell(0);
      cellTitleAndLink.innerHTML = `<a class = "article-link" href = "${
        results[3][i]
      }"> ${results[1][i]} </a>`;
      let cellSummary = row.insertCell(1);
      cellSummary.innerHTML = results[2][i];
    }
  };
};

// search by location
const geoSearchButton = document.getElementById("geo-search");
geoSearchButton.addEventListener("click", e => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handleGeoSearch);
  } else {
    alert("Geolocation not supported");
  }
});
let geo;

const handleGeoSearch = pos => {
  // calls XML http request for the input search value
  geo = pos.coords;
  const lat = pos.coords.latitude;
  const long = pos.coords.longitude;
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&format=json&origin=*&gscoord=${lat}|${long}&gsradius=10000&gslimit=10`,
    true
  );
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xhr.send();
  // xhr.send(params);
  // logs the results of the search
  xhr.onreadystatechange = () => {
    // an array in format [0: "searchvalue", 1: [search result names], 2: [search result summaries], 3: [result URLs]]
    // gives top 10 results
    const results = JSON.parse(xhr.response);
    console.log(results);
    // clears previous results
    let table = document.getElementById("results-table");
    if (!results.query.geosearch.length) {
      table.innerHTML = "";
      let row = table.insertRow(0);
      let cell = row.insertCell(0);
      cell.innerHTML = "no results found";
    } else {
      table.innerHTML = "";
    }
    // loop through search results, display in table
    //TODO : table formatting
    const geoResults = results.query.geosearch.sort((a, b) => a.dist - b.dist);
    for (let i = 0; i < geoResults.length; i++) {
      console.log(geoResults[i]);
      let articleid = geoResults[i].pageid;
      let row = table.insertRow();
      let cellTitle = row.insertCell();
      let cellDistance = row.insertCell();
      cellDistance.innerHTML = `  ${geoResults[i].dist}m away..`;
      cellTitle.innerHTML = `<a href = 'http://en.wikipedia.org/wiki?curid=${articleid}  '>${
        geoResults[i].title
      }</a>`;
      // let row = table.insertRow(i);
      // let cellTitleAndLink = row.insertCell(0);
      // cellTitleAndLink.innerHTML = `<a class = "article-link" href = "${
      //   results[3][i]
      // }"> ${results[1][i]} </a>`;
      // let cellSummary = row.insertCell(1);
      // cellSummary.innerHTML = results[2][i];
    }
  };
};
