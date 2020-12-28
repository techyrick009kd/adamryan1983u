export class CalendarService {

  getEvents(props) {
      let file = props.division
      return fetch(`./data/schedule/${file}schedule.json`).then(res => res.json()).then(d => d.data);
  }
}