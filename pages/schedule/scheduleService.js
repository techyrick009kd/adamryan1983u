import axios from 'axios';
export class ScheduleService {

  getEvents(props) {
    let division = props.division
    return fetch(`./data/schedule/${division}schedule.json`).then(res => res.json())
      .then(d => d.data);
  }
}
  // let axios = require('axios');
  // let data = JSON.stringify({
  //   "operation":"describe_table",
  //   "table":"schedule",
  //   "schema":division,
  // });

  // const config = {
  //   method: 'post',
  //   url: 'https://bimhl-adamryan.harperdbcloud.com',
  //   headers: { 
  //     'Content-Type': 'application/json', 
  //     'Authorization': 'Basic YWRhbXJ5YW46VDB4IWMhdHljYXI='
  //   },
  //   data : data
  // };

  // return axios(config)
  // .then((response => response.json()).then(d => d.data))
  // .catch(function (error) {
  //   console.log(error);
  // });
  // }