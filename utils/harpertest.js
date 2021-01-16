import { HarperDB } from "harperdbjs"

const url = "https://bimhl-adamryan.harperdbcloud.com"
const token = process.env.NEXT_PUBLIC_HARPER_TOKEN
const user = process.env.NEXT_PUBLIC_DB_USER
const pass = process.env.NEXT_PUBLIC_DB_PASS


const harperdb = new HarperDB({ 
  url:url,
  token: token
})

export default harperdb