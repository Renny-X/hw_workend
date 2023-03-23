import { v4 as uuidv4 } from 'uuid';
import CronParser from 'cron-parser';
import moment from 'moment';
import * as url from 'url'
import * as fs from 'fs';
import * as path from 'path';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dateCron = '0 0 0 ? * 6L'
const startM = '20230201'
const endM = '20240101'

function testUUID() {

  const interval = CronParser.parseExpression(dateCron, {
    currentDate: startM,
    endDate: endM,
    iterator: true,
    tz: 'Asia/Shanghai'
  });
  let vevents = '';
  const vevent = fs.readFileSync(path.join(__dirname, '/template/vevent.template'), 'utf-8');
  let ics = fs.readFileSync(path.join(__dirname, '/template/hw_ics.template'), 'utf-8');

  while (true) {
    try {
      const obj = interval.next();
      const date = moment(obj.value.toDate()).format('YYYYMMDD');
      // console.log(date);
      let tmpV = vevent.replace(/<--date-->/g, date);
      tmpV = tmpV.replace(/<--uuid-->/g, uuidv4());
      vevents = `${vevents}\n${tmpV}`
    } catch (e) {
      break;
    }
  }
  vevents = vevents.trim();

  ics = ics.replace(/<--ReplaceMe-->/g, vevents);

  fs.writeFileSync(path.join(__dirname, '/output/hw_workend.ics'), Buffer.from(ics));
  
}

testUUID();
