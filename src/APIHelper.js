

const APIHelper = {
    testFunc(APIData) {
        fetch('https://api.census.gov/data/timeseries/eits')
        .then(res => res.json())
        .then((data) => {
          APIData = data;
          return APIData;
        })
        .catch(console.log)
    }
}

export default APIHelper