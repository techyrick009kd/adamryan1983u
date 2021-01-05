export const harperFetch = async (props:any) => {
  const myHeaders = new Headers();

  const raw = JSON.stringify({
      "operation": "sql",
      "sql": `SELECT * FROM roster.${props}roster`
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  const request = await fetch("https://bimhl-adamryan.harperdbcloud.com", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error))
}